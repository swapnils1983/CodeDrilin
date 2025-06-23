const axios = require('axios');


const getIdByLanguage = (lang) => {
    const language = {
        "c++": 54,
        "java": 62,
        "javascript": 63
    }

    return language[lang.toLowerCase()]
}


const submitBatch = async (submissions) => {


    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'false'
        },
        headers: {
            'x-rapidapi-key': '545fc4406fmsh1d4dc844e83e661p1dd663jsnbb888e17a885',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data
        } catch (error) {
            console.log(error);
        }
    }

    return await fetchData();
}

const waiting = async (timer) => {
    setTimeout(() => {
        return 1
    }, timer)
}
const submitToken = async (resultToken) => {


    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultToken.join(","),
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': '545fc4406fmsh1d4dc844e83e661p1dd663jsnbb888e17a885',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data
        } catch (error) {
            console.log(error);
        }
    }


    while (true) {
        const result = await fetchData();

        const isResultObtained = result.submissions.every((r) => r.status_id > 2)
        if (isResultObtained) {
            return result.submissions
        }

        waiting(1000)
    }
}
module.exports = { getIdByLanguage, submitBatch, submitToken }