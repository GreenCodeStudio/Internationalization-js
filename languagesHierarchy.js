export class LanguagesHierarchy {
    constructor(langs = []) {
        this.langs = langs;
    }

    pickBest(available) {
        for (let lang of this.langs) {
            if (!lang) continue;
            for (let x of available) {
                if (lang == x) return x;
            }
            for (let x of available) {
                if (x.substr(0,2).toLowerCase()==lang.substr(0,2).toLowerCase()) return x;
            }
        }
        return available[0];
    }

    static readFromUser() {
        return new LanguagesHierarchy([document.documentElement.lang, ...navigator.languages]);
    }
}

LanguagesHierarchy.default = LanguagesHierarchy.readFromUser();