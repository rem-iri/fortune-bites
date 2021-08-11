"use strict";

Vue.component("c-fortune", {
    props: {
        fortune: String,
        title: String
    },
    data: function () {
        return {
            text: this.fortune
        }
    },
    template: `
    <div class="card fortune m-3">
        <div class="card-body">
        <h5 class="card-title">{{ title }}</h5>
        <!-- <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> -->
        <p class="card-text">{{ text }}</p>
        <!-- <a href="#" class="card-link">Card link</a>
        <a href="#" class="card-link">Another link</a> -->
        </div>
    </div>
    `,
})

Vue.component("c-categories", {
    data: function () {
        return {
            "CATEGORIES": {
                "art": "Art 🎨",
                "cookie": "Cookie 🥠",
                "definitions": "Lucky Noun 🥚",
                "drugs": "Drugs 💊",
                "education": "Education 🎓",
                "food": "Food 🍕",
                "fortunes": "Fortunes 🔮",
                "humorists": "Quotes 📜",
                "kids": "Kids 👪",
                "law": "Law ⚖️",
                "literature": "Literature 📖",
                "love": "Love ❤️",
                "magic": "Magic 🦄",
                "medicine": "Health 👨‍⚕️",
                "miscellaneous": "Miscellaneous 🎲",
                "news": "News 📰",
                "paradoxum": "Paradoxum 🤡",
                "people": "People 👥",
                "pets": "Pets 🐱",
                "politics": "Politics 🏛️",
                "pratchett": "Riddles ❓",
                "science": "Science ⚛️",
                "songs-poems": "Songs-poems 🎵",
                "sports": "Sports 🥇",
                "tao": "Tao ☯️",
                "translate-me": "LOREM-IPSUM 🔠",
                "wisdom": "Wisdom 🤔",
                "work": "Work 💼"
            },
        }
    },
    methods: {
        emitSelectionDone: function() {
            let elements = document.querySelectorAll('.category-checkbox:checked');
            let selectedCategories = [];

            for(let e of elements) {
                let key = e.getAttribute("value");
                let value = e.getAttribute("title");

                selectedCategories.push({[key]: value});
            }

            this.$emit('selectionDone', selectedCategories);
            document.querySelectorAll("#fortunesSpinner")[0].classList.remove("d-none");
        }
    },
    template: `
        <div class="modal fade" id="categoriesModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Select a category</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="category-item" v-for="(value, key) in this['CATEGORIES']" :key="key.id">
                            <input class="category-checkbox" type="checkbox" :value="key" :title="value">
                            <span>{{ value }}</span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button id="btnGetFortuneSpinner" type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="emitSelectionDone">
                            Get Fortune
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
})

let app = new Vue({
    el: "#app",
    data: function () {
        return { 
            "fortunes": [],
            "isLoading": false,
        }
    },
    methods: {
        getFortunes: async function (categories) {
            let temp = this;
            let loadingMs = 2000;

            // Dummy loading
            setTimeout(async function() {
                // Real getFortunes function
                let thisObj = temp;
                let promises = [];
                let baseURL = "/api/fortune/";
                let fetchedFortunes = [];
                
                for(let item of categories) {
                    let key = Object.keys(item)[0];
                    promises.push( fetch( baseURL + key ) );
                }

                let promises_all = await Promise.allSettled(promises);
                promises_all.forEach( (result) => { 
                    if( result.status === "fulfilled") {
                        result.value.json().then( (result) => {
                            let temp = result;

                            //thisObj.fortunes.push( this.stringToHtml(fortune) )
                            let fortune = thisObj.stringToHtml(result["fortune"]);
                            let title = "";

                            for(let c of categories) {
                                if(c[result["category"]]) {
                                    title = c[result["category"]];
                                    break;
                                }
                            }

                            fetchedFortunes.push( {"fortune": fortune, "title": title} );
                            console.log( fortune );
                        })
                        thisObj.isLoading = false;
                    } 
                })

                document.querySelectorAll("#fortunesSpinner")[0].classList.add("d-none");
                thisObj.fortunes = fetchedFortunes;
            }, loadingMs)
        },
        stringToHtml: function (string) {
            return string.replace(/\\t/g, "&nbsp&nbsp&nbsp&nbsp");
        },
    },
    created: function () {
        console.log("App created.")
    },
    template: `
        <div class="container d-flex flex-column align-items-center justify-content-center">
            <button id="getFortune"  data-bs-toggle="modal" data-bs-target="#categoriesModal">
                <h3 class="get-fortune-text">Get Fortune ✨</h3>
            </button>

            <div id="fortunesSpinner" class="d-none">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Snapping Cookies...</span>
            </div>
            
            <div class="card-container">            
                <c-fortune class="" v-for="fortune in fortunes" :key="fortune.id" :fortune="fortune['fortune']" :title="fortune['title']"></c-fortune>
            </div>
            <c-categories v-on:selectionDone="getFortunes"></c-categories>
            
        </div>
    `
});