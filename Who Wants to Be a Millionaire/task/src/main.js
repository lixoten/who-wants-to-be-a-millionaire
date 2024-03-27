const game = async () => {
    try {
        const url = 'http://localhost:8080/question.json';
        const response = await fetch(url);
        if (!response.ok) {
            const errorMessage = `Failed to fetch data from ${url}: ${response.status} ${response.statusText}`;
            document.getElementById("container").textContent = errorMessage;
            return; // Exit if fail
        }

        const data = await response.json();
        const container = document.getElementById("container");
        // const extraContainer = document.getElementById("extraInfo");

        const MAX_QUESTIONS = 15;

        // Generate a random index for the first question
        let questionIndex = 0;
        //let questionIndex = Math.floor(Math.random() * data.length);
        // let totQuestion = data.length;

        let totalCorrectQuestions = 0;
        let totalAskedQuestions = 0;


        //const option = ['A', 'B', 'C', 'D'];
        let optionsKeyArr = ['A', 'B', 'C', 'D'];

        function dispQuestion(question) {
            container.textContent = ''; // Clear container for the new question

            const p = document.createElement("p");
            p.textContent = (totalAskedQuestions + 1) + ". " + question;
            container.appendChild(p);

        }

        function dispOptions(optionsArr, answer) {
            const ol = document.createElement("ol");
            container.appendChild(ol);

            optionsArr.forEach(function (optionText, index) {
                const li = document.createElement("li");
                //li.textContent = `${optionsArr[index]}. ${optionText}`;
                li.textContent = `${optionsArr[index]}. ${data[questionIndex][optionsArr[index]]}`;

                li.classList.add("opt");
                li.addEventListener('click', () => {
                    totalAskedQuestions++;
                    if (checkAnswer(index, answer)) {
                        totalCorrectQuestions++;
                        questionIndex++;
                        processQuestion();
                    } else {
                        gameOver()
                        return;
                    }
                });

                ol.appendChild(li);
            });
        }

        function checkAnswer(userAnswer, correctAnswer) {
            return (optionsKeyArr[userAnswer] === correctAnswer);
        }


        function gameOver() {
            container.textContent = ''; // Clear container

            const p = document.createElement("p");
            p.textContent = "You Lose! " + `You got a total of ${totalCorrectQuestions} right.`;
            container.appendChild(p);
        }

        function gameOverYouWin() {
            container.textContent = ''; // Clear container

            const p = document.createElement("p");
            p.textContent = "YOU WIN! " + `You got a total of ${totalCorrectQuestions} right.`;
            container.appendChild(p);
        }

        const processQuestion = () => {
            const question = data[questionIndex]['question'];
            // const optionA = data[questionIndex]['A'];
            // const optionB = data[questionIndex]['B'];
            // const optionC = data[questionIndex]['C'];
            // const optionD = data[questionIndex]['D'];
            const answer = data[questionIndex]['answer'];

            if (!question) return; // No more questions

            if (!question || totalAskedQuestions >= MAX_QUESTIONS) {
                if (totalAskedQuestions >= MAX_QUESTIONS) {
                    gameOverYouWin();
                } else {
                    gameOver();
                }
                //someExtraInfo(answer);
                return;
            }

            dispQuestion(question);
            dispOptions(optionsKeyArr, answer);
        };

        processQuestion();

    } catch (error) {
        document.getElementById("container").textContent = `Unexpected error: ${error.message}`;
    }
}

game();