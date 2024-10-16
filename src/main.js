// slider
var swiper = new Swiper(".swiper-portfolio", {
    loop: true,
    speed: 500,

    navigation: {
        nextEl: ".slider-btn--next",
        prevEl: ".slider-btn--prev",
    },
    breakpoints: {

        0: {
            slidesPerView: 1,
            spaceBetween: 15,
        },

        780: {
            slidesPerView: 2,
            spaceBetween: 40,
        },
        1180: {
            slidesPerView: 3,
            spaceBetween: 40,
        }
    }
});

var swiper = new Swiper(".swiper-reviews", {
    loop: true,
    speed: 500,
    slidesOffsetBefore: -window.innerWidth / 8,
    breakpoints: {

        0: {
            slidesPerView: 1.2,
            centeredSlides: true,
            spaceBetween: 15,
            slidesOffsetBefore: 0,
        },

        980: {
            centeredSlides: false,
            slidesPerView: 3,
            spaceBetween: 15,
        },

        1440: {
            spaceBetween: 40,
            slidesPerView: 4,
        }
    }
});

// burger

const headerBurger = document.querySelector('.header__burger'),
    headerControl = document.querySelector('.header__controls'),
    menuControls = document.querySelectorAll('.header__nav-item');

headerBurger.addEventListener('click', () => {
    headerBurger.classList.toggle('header__burger--active');
    headerControl.classList.toggle('header__controls--active')
});

menuControls.forEach(item => {
    item.addEventListener('click', (e) => {
        const navItem = e.target.closest('.header__nav-item');
        if (navItem) {
            const sectionId = navItem.getAttribute('section-id');
            scrollToSection(sectionId);
        }
        headerControl.classList.remove('header__controls--active');
        headerBurger.classList.remove('header__burger--active');
    });
});


// tab item
let tabItems = document.querySelectorAll('.tab__item');

tabItems.forEach(item => {
    const tabText = item.querySelector('.tab__item-text');

    item.addEventListener('click', () => {

        tabItems.forEach(otherItem => {
            const otherTabText = otherItem.querySelector('.tab__item-text');
            if (otherItem !== item) {
                otherItem.classList.remove('tab__item--active');
                otherTabText.style.maxHeight = '0';
            }
        });

        item.classList.toggle('tab__item--active');

        if (item.classList.contains('tab__item--active')) {
            tabText.style.maxHeight = `${tabText.scrollHeight + 40}px`;
            setTimeout(() => {
                tabText.style.maxHeight = 'unset';
            }, 400);
        } else {
            tabText.style.maxHeight = '0';
        }
    });
});

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offset = window.innerWidth < 1440 ? 90 : 120;
        const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: sectionPosition,
            behavior: 'smooth' // Плавная прокрутка
        });
    }
}

// work-process

document.addEventListener('scroll', function (res) {

    checkSectionInView();

    const items = document.querySelectorAll('.work-process__item');
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;

    items.forEach(item => {
        const itemPosition = item.getBoundingClientRect().top + scrollPosition;

        if (scrollPosition + windowHeight - 200 >= itemPosition) {

            items.forEach(i => i.classList.remove('work-process__item--active'));

            item.classList.add('work-process__item--active');
        }
    });

});

// form

const phoneInputs = document.querySelectorAll('input[name="phone"]');
let itiInstances = [];


phoneInputs.forEach(input => {
    let iti = window.intlTelInput(input, {
        initialCountry: "auto",
        geoIpLookup: function (callback) {
            fetch('https://ipinfo.io/json', { cache: 'reload' })
                .then(response => response.json())
                .then(data => callback(data.country))
                .catch(() => callback('us'));
        },
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@24.4.0/build/js/utils.js",
        allowDropdown: true,
        autoHideDialCode: false,
        separateDialCode: true,
    });

    itiInstances.push(iti);
});

let forms = [document.querySelector('#form-page'), document.querySelector('#form-cta'), document.querySelector("#form-calc")];

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let nameField = form.querySelector('input[name="name"]');
        let emailField = form.querySelector('input[name="email"]');
        let phoneField = form.querySelector('input[name="phone"]');

        let isValid = true;
        clearErrors();


        if (!validateField(nameField, /^[a-zA-Zа-яА-Я]{2,15}$/)) {
            isValid = false;
        }

        if (!validateField(emailField, /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/)) {
            isValid = false;
        }

        if (isValid) {

            const data = Object.fromEntries(new FormData(form).entries())
            data['interest'] = [];
            form.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
                if (checkbox.checked) {
                    data['interest'].push(checkbox.value);
                }
            });

            grecaptcha.execute('6LfBVU0nAAAAAORPhJVusD5Jx8eoC--Y5gFPHV9P', {action: 'submit'}).then(function(token) {
                console.log(token);
                var xhr = new XMLHttpRequest();
                var url = "https://api.garno.tech/landing/leads/web-leads-form";
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.setRequestHeader("x-api-key", "Yu6rkH97Hk9299s76k7gYTBhUe3RZApzBG44Pv36v7JS5cFSP799yiKucpvg2Eb5");
                xhr.setRequestHeader("recaptcha", token);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        try {
                            const json = JSON.parse(xhr.responseText);
                            if (json.status) {
                                form.reset();
                                clearErrors();
                                showSuccessForm();
                                document.querySelector('.modal--active').classList.remove('modal--active');
                                document.body.style.overflow = 'auto';
                            } else {
                                showErrorForm();
                            }
                        } catch (err) {
                            showSuccessForm();
                        }
                    }
                };
                xhr.send(JSON.stringify({ ...data, language: window.SelectedLanguage }));
            });

        }
    });
});

function validateField(input, pattern, errorMessage) {
    let value = input.value.trim();
    if (value === '' || !pattern.test(value)) {
        showError(input);
        return false;
    }
    return true;
}

function showError(input) {
    let parentElement = input.closest('.form-block__item');
    parentElement.classList.add('input-error');

    input.addEventListener('input', function () {
        let value = input.value.trim();
        let form = input.closest('form');

        if (input === form.querySelector('input[name="name"]') && /^[a-zA-Zа-яА-Я]{2,15}$/.test(value)) {
            parentElement.classList.remove('input-error');
        }

        if (input === form.querySelector('input[name="email"]') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            parentElement.classList.remove('input-error');
        }

        const phoneIndex = Array.from(phoneInputs).indexOf(input);
        if (phoneIndex > -1 && itiInstances[phoneIndex].isValidNumber()) {
            parentElement.classList.remove('input-error');
        }
    });
}

function clearErrors() {
    let errors = document.querySelectorAll('.input-error');
    errors.forEach(error => error.classList.remove('input-error'));
}

function showErrorForm() {
    const success = document.getElementById('notification-error');
    if (success) {
        success.classList.add('prepare');
        setTimeout(() => {
            success.classList.add('active');
        }, 100)
        window.successCloseTimer = setTimeout(() => {
            hideErrorSnakeBar()
        }, 5000);
    }
}

document.getElementById('notification-error-close').addEventListener('click', (e) => {
    hideErrorSnakeBar();
});

function hideErrorSnakeBar() {
    const success = document.getElementById('notification-error');
    clearTimeout(window.successCloseTimer);
    if (success) {
        success.classList.remove('active');
        setTimeout(() => {
            success.classList.remove('prepare');
        }, 100);
    }
}

function showSuccessForm() {
    const success = document.getElementById('notification-success');
    if (success) {
        success.classList.add('prepare');
        setTimeout(() => {
            success.classList.add('active');
        }, 100)
        window.successCloseTimer = setTimeout(() => {
            hideSuccessSnakeBar()
        }, 5000);
    }
}

document.getElementById('notification-success-close').addEventListener('click', (e) => {
    hideSuccessSnakeBar();
});

function hideSuccessSnakeBar() {
    const success = document.getElementById('notification-success');
    clearTimeout(window.successCloseTimer);
    if (success) {
        success.classList.remove('active');
        setTimeout(() => {
            success.classList.remove('prepare');
        }, 100);
    }
}

// modal


const modalBtnCta = document.querySelectorAll('[data-modal="modal_cta"]'),
    modalCta = document.querySelector('.modal--consultation'),
    modalCalc = document.querySelector('.modal--calc'),
    modalBtnCalc = document.querySelectorAll('[data-modal="modal_calc"]'),
    modalBtnClose = document.querySelectorAll('.btn__modal-close'),
    modalBtnLang = document.querySelectorAll('[data-modal="modal_lang"]'),
    modalLang = document.querySelector('.modal--lang');

function openModal(modalbtn, modal) {
    modalbtn.forEach(item => {
        item.addEventListener('click', () => {

            if (document.querySelector('.header__controls--active')) {
                headerControl.classList.remove('header__controls--active');
                headerBurger.classList.remove('header__burger--active');
            }

            modal.classList.add('modal--active');
            document.body.style.overflow = 'hidden';
        });
    });
}

function closeModal(btnClose) {
    btnClose.forEach(item => {
        item.addEventListener('click', () => {
            document.querySelector('.modal--active').classList.remove('modal--active');
            document.body.style.overflow = 'auto';
        });
    });

}

openModal(modalBtnCta, modalCta);
openModal(modalBtnCalc, modalCalc);
openModal(modalBtnLang, modalLang);
// modalLang
closeModal(modalBtnClose)

// form calc

let formCalcItem = document.querySelectorAll('.form-calc .form-block'),
    formCalcbtn = document.querySelector('.form-calc .btn-primary.btn-primary--green'),
    formCalcBack = document.querySelector('.form-calc .btn-primary.btn-primary--disabled');


let step = 0;
function hidenFormCalcItem() {
    formCalcItem.forEach(item => {
        item.style.display = 'none';
    });
}

function showFormCalcItem(step) {
    formCalcItem[step].style.display = 'block';
}

function checkBtn(step) {
    if (step === 0) {
        formCalcBack.style.display = 'none';
    } else {
        formCalcBack.style.display = 'flex';
    }
}

formCalcbtn.addEventListener('click', () => {
    if (step < (formCalcItem.length - 1)) {
        step++;
        hidenFormCalcItem()
        showFormCalcItem(step)
        checkBtn(step);

        formCalcbtn.type = 'button';
    } else {
        formCalcbtn.type = 'submit';
    }
});

formCalcBack.addEventListener('click', () => {
    if (step > 0) {
        step--;
        hidenFormCalcItem()
        showFormCalcItem(step)
        checkBtn(step)
    }
});


hidenFormCalcItem();
showFormCalcItem(step);
checkBtn(step);


window.onresize = function() {
    checkSectionInView();
};

// Функция для удаления класса 'active' со всех элементов меню
function removeActiveClasses() {
    document.querySelectorAll('.header__nav-item').forEach(item => {
        item.classList.remove('active');
    });
}

// Функция для добавления класса 'active' к нужному элементу меню
function addActiveClass(sectionId) {
    const navItem = document.querySelector(`.header__nav-item[section-id="${sectionId}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
}

// Функция для проверки видимости секции
function checkSectionInView() {
    let currentSection = null;

    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;

        if (sectionTop <= window.innerHeight / 2 && sectionTop + sectionHeight >= window.innerHeight / 2) {
            currentSection = section;
        }
    });

    if (currentSection) {
        removeActiveClasses();
        addActiveClass(currentSection.id);
    }
}

let lastScrollTop = 0;

window.addEventListener('scroll', function() {
    const banner = document.querySelector('.banner');
    const bannerImage = document.querySelector('.banner img');
    const founder = document.querySelector('.founder');
    const founderImage = document.querySelector('.founder img');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    function handleImagePosition(element, image) {
        if (scrollTop > lastScrollTop) {
            if (scrollTop > element.offsetTop) {
                image.style.position = 'fixed';
                image.style.top = '0';
            }
        } else {
            image.style.position = 'absolute';
            image.style.top = '0';
        }
    }

    handleImagePosition(banner, bannerImage);
    handleImagePosition(founder, founderImage);

    lastScrollTop = scrollTop;
});
