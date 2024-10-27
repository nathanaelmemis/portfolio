export interface Project {
    name: string
    description: string
    hasMobile: boolean
    stretchImage: boolean
    links: {
        text: string
        url: string
    }[]
}

export const PROJECTS: Project[] = [
    { 
        name: "Calpal", 
        description: "Calpal is a calorie tracking web app and mobile app. I built the web app using the MERN stack. I utilized React Native and react-native-webview package for the mobile app.", 
        hasMobile: true,
        stretchImage: false,
        links: [
            { text: "GitHub - Website", url: "https://github.com/nathanaelmemis/calpal" },
            { text: "GitHub - Mobile", url: "https://github.com/nathanaelmemis/calpal" },
            { text: "Website", url: "https://calpal-nsem.vercel.app/" }
        ]
    },
    { 
        name: "Vantablack", 
        description: "Vantablack is an anonymized encrypted messaging web app. It uses Sha256 for hashing and AES for encryption. I utilized React and Firebase Realtime Database for this project.", 
        hasMobile: false,
        stretchImage: false,
        links: [
            { text: "GitHub", url: "https://github.com/nathanaelmemis/vantablack" },
            { text: "Website", url: "https://nathanaelmemis.github.io/vantablack/" }
        ]
    },
    { 
        name: "ResumeChecker", 
        description: "A resume screening tool that utilized the tranformer encoder model and cosine similarity to rank candidates based on their qualifications against the job description. I was the main developer of the ML model where it was written only using Numpy.", 
        hasMobile: false,
        stretchImage: true,
        links: []
    },
    { 
        name: "FixItNow!", 
        description: "A maintenance reporting system that has a mobile app for clients and a web app for the maintenance department. I was the main developer for the web app where I utilized Firebase for the database.", 
        hasMobile: true,
        stretchImage: true,
        links: [
            { text: "GitHub - Website", url: "https://github.com/nathanaelmemis/fixitnow" },
            { text: "GitHub - Mobile", url: "https://github.com/nathanaelmemis/fixitnow_mobile_app" },
            { text: "Website", url: "https://fix-it-now.netlify.app/" }
        ]
    },
    { 
        name: "7576 Book Binding Services", 
        description: "A database management web app for the company 7576 Book Binding Services. It features CRUD operations for data management. I utilized PHP and MySQL for the backend.", 
        hasMobile: false,
        stretchImage: true,
        links: [
            { text: "GitHub", url: "https://github.com/nathanaelmemis/7576-Bookbinding-Services-Website" },
        ]
    },
    { 
        name: "BarakoCoffee", 
        description: "An OOP language featuring the core components of an OOP programming language that can be written in English, Tagalog, or both. I was the main developer of the Lexical and Syntax analyzer of this compiler.", 
        hasMobile: false,
        stretchImage: false,
        links: [
            { text: "GitHub", url: "https://github.com/nathanaelmemis/BarakoCoffeePL" },
        ]
    },
]