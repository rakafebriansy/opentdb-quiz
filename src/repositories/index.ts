import axios from "axios";

export const fetchQuizFromApi = async (amount: number): Promise<object[]> => {
    const response = await axios.get(`https://opentdb.com/api.php?amount=${amount}`);
    return response.data.results;
}