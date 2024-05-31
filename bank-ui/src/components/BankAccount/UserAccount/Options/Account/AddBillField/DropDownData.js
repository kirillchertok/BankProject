const dropDownData = [
    {
        type: "currency",
        data: [
            {
                name: "USD",
                img: "/US-flag.png",
                alt: "US-flag"
            },
            {
                name: "EUR",
                img: "/ES-flag.png",
                alt: "ES-flag"
            },
            {
                name: "RUB",
                img: "/RU-flag.png",
                alt: "RU-flag"
            },
            {
                name: "BYN",
                img: "/BY-flag.png",
                alt: "BY-flag"
            },
        ]
    },

    {
        type: "role",
        data: [
            "Физ. лицо",
            "Компания",
            "Гос. организация"
        ]
    },

    {
        type: "purpose",
        data: [
            {
                role: "Физ. лицо",
                purposes: [
                    "Переводы и хранение средств",
                    "Предпринимательство",
                    "Эскроу для покупки жилья"
                ]
            },

            {
                role: "Компания",
                purposes: [
                    "Финансовые услуги",
                    "Некоммерческая деятельность",
                    "Продажа продукции"
                ]
            }
        ]
    }
]

export default dropDownData;