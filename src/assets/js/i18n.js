
class TranslateService {

    allowLang = ["ru", "ua", "pl", "fr", "en", "de"];
    defaultLanguage = "ru";
    langPath = "./assets/i18n/";
    langButtons;

    locale = {
        AT: "austria",
        BE: "belgium",
        DE: "germany",
        GR: "greece",
        IE: "ireland",
        ES: "spain",
        IT: "italy",
        CY: "cyprus",
        LV: "latvia",
        LT: "lithuania",
        LU: "luxembourg",
        MT: "malta",
        NL: "netherlands",
        PT: "portugal",
        SK: "slovakia",
        SI: "slovenia",
        FI: "finland",
        FR: "france",
        HR: "croatia",
        EE: "estonia",
        UK: "uk",
        US: "usa",
        CA: "canada"
    }


    constructor() {
        this.langButtons = document.querySelectorAll('.modal--lang .btn-primary');
        this.langButtons.forEach(item => {
            item.addEventListener('click', (e) => {
                const button = e.target.closest('.btn-primary');
                const lang = button.getAttribute('lang');
                localStorage.setItem('garno_tech_language', lang);
                this.changeLanguage(lang);
                const popup = e.target.closest('.modal--lang');
                if (popup) {
                    popup.classList.remove('modal--active');
                    document.body.style.overflow = 'auto';
                }
            });
        });
        this.setupLanguage().then()
    }

    async setupLanguage() {
        const location = await this.getLocation();

        if (location && location.country_code && this.locale[location.country_code]) {
            const localeTitle = document.getElementById('locale-title');
            if (localeTitle) {
                localeTitle.setAttribute('data-i18n', `hero.title.${this.locale[location.country_code]}`);
            }
            const localeSubtitle = document.getElementById('locale-subtitle');
            if (localeSubtitle) {
                localeSubtitle.setAttribute('data-i18n', `hero.subtitle.${this.locale[location.country_code]}`);
            }
            const localeProjects = document.getElementById('locale-projects');
            if (localeProjects) {
                localeProjects.setAttribute('data-i18n', `whyus.project.title.${this.locale[location.country_code]}`);
            }
        }

        const selectedLanguage = localStorage.getItem('garno_tech_language');
        const userLang = navigator.language || navigator.userLanguage;
        if (selectedLanguage && this.allowLang.includes(selectedLanguage)) {
            this.changeLanguage(selectedLanguage);
        } else {
            if (userLang) {
                const index = this.allowLang.findIndex((lang) => userLang.includes(lang));
                if (index > -1) {
                    this.changeLanguage(this.allowLang[index]);
                } else {
                    this.changeLanguage(this.defaultLanguage);
                }
            } else {
                this.changeLanguage(this.defaultLanguage);
            }
        }

    }

    async getLocation() {
        const url = "https://ipwho.is/";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {}
    }

    getJSONUrl(lang) {
        return this.langPath + lang + ".json";
    }

    changeLanguage(lang = 'en') {
        if (!lang || this.allowLang.indexOf(lang.toLowerCase()) <= -1 ) {
            return;
        }
        window.SelectedLanguage = lang;
        this.langButtons.forEach(item => {
            const key = item.getAttribute('lang');
            if (key === lang) {
                item.classList.add('btn-primary__lang-active')
            } else {
                item.classList.remove('btn-primary__lang-active');
            }
        });
        this.readTextFile(this.getJSONUrl(lang), this.replaceLang);
    }

    readTextFile(file, callback) {
        const rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status === 200) {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }

    replaceLang(jsonData) {
        try {
            const parsedData = JSON.parse(jsonData);
            document.querySelectorAll("[data-i18n]").forEach(function(element) {
                if (!parsedData[element.dataset.i18n]) {
                    return;
                }
                if (element.dataset.i18n_target) {
                    element[element.dataset.i18n_target] = parsedData[element.dataset.i18n];
                } else {
                    switch(element.tagName.toLowerCase()) {
                        case "input":
                        case "textarea":
                            element.placeholder = parsedData[element.dataset.i18n];
                            return;
                        case "meta":
                            element.content = parsedData[element.dataset.i18n];
                            return;
                        default:
                            element.innerHTML = parsedData[element.dataset.i18n];
                    }
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

}

window.TranslateService = new TranslateService();
