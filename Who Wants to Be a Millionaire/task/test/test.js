import path from "path";
import {StageTest, correct, wrong} from "hs-test-web-ts";
import {doc} from "mocha/lib/reporters/index.js";

const pagePath = path.join(import.meta.url, "../../src/index.html");

class Test extends StageTest {
    page = this.getPage(pagePath);

    tests = [
        // Test 1 - check the open page
        this.node.execute(async () => {
            await this.page.open();
            return correct();
        }),

        // test 1.1
        this.page.execute(async () => {
            // helper function
            this.getData = () => {
                return this.data;
            };
            this.data = null;
            this.URL = "http://127.0.0.1:8080/question.json";
            try {
                const response = await fetch(this.URL);
                this.data = await response.json();
                return correct();
            } catch (e) {
                return wrong("Failed to load questions. Make sure you're running the 'http-server --cors' in the directory where the HTML file is located.");
            }
        }),

        // Test 2 - check container
        this.page.execute(() => {
            const container = document.getElementById("container");
            return container ?
                correct() :
                wrong("Not found container. You should create a container with id=container")
        }),

        // Test 3 - check the output questions
        this.page.execute(async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const container = document.getElementById("container");
            const containerText = container.textContent;

            let isQuestion = false;
            for (let i in this.data) {
                if (containerText.includes(this.data[i].question)) {
                    isQuestion = true;
                }
            }
            return isQuestion === true ? correct() : wrong("Questions and answer options are not displayed on the page.");
        }),

        // Test 4 - check switch levels
        this.node.execute(async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.container = await this.page.findById('container');
            this.index = {'A': 0, 'B': 1, 'C': 2, 'D': 3};

            let data = await this.page.evaluate(() => {
                return this.getData();
            });

            this.checkQuestions = async () => {
                let containerText = await this.container.textContent();
                const answers = await this.page.findAllBySelector("li");
                let isEventHappened = false;
                for (let i in data) {
                    if (containerText.includes(data[i].question)) {
                        let indexAnswer = this.index[data[i].answer];
                        if (!answers[indexAnswer]) return isEventHappened;
                        isEventHappened = answers[indexAnswer].waitForEvent("click", 2000);
                        await answers[indexAnswer].click();
                    }
                }
                return isEventHappened;
            }
            let isEventHappened = await this.checkQuestions();
            if (isEventHappened === false) {
                return wrong('Does not proceed to the next question. After clicking on the correct answer, the following question should be displayed.');
            } else return correct();
        }),

        // Test 5 -  check output no more than 15 question
        this.node.execute(async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            let countQuestions = 0;

            let data = await this.page.evaluate(() => {
                return this.getData();
            });

            this.checkQuestions = async () => {
                let containerText = await this.container.textContent();
                const answers = await this.page.findAllBySelector("li");
                let isEventHappened = false;
                for (let i in data) {
                    if (containerText.includes(data[i].question)) {
                        countQuestions++;
                        let indexAnswer = this.index[data[i].answer];
                        if (!answers[indexAnswer]) return isEventHappened;
                        isEventHappened = answers[indexAnswer].waitForEvent("click", 2000);
                        await answers[indexAnswer].click();
                    }
                }
                return isEventHappened;

            }
            while (countQuestions < 13) {
                let isEventHappened = await this.checkQuestions();
                if (isEventHappened !== true) {
                    return wrong('The user\'s answer is incorrectly marked or not 15 questions are displayed.');
                }
            }
            return correct();
        }),
    ]
}

it("Test stage", async () => {
    await new Test().runTests()
}).timeout(30000);
