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
            container.innerHTML = `<p>${(totalAskedQuestions + 1)} ${question}</p>`;
        }

        function dispOptions(optionsArr, answer) {
            let tempLi= "";

            optionsArr.forEach(function (optionText, index) {
                tempLi += `<li class="opt" 
                               >
                               ${optionsArr[index]}. ${data[questionIndex][optionsArr[index]]}</li>`;
            });

            const tempOl = `<ol>${tempLi}</ol>`;
            container.innerHTML += tempOl;

            // Attach event listeners to the options
            document.querySelectorAll('#opt').forEach((option, index) => {
                option.addEventListener('click', () => handleOptionClick(index, answer));
            });
        }

        function handleOptionClick(index, answer) {
            totalAskedQuestions++;
            if (checkAnswer(index, answer)) {
                totalCorrectQuestions++;
                questionIndex++;
                processQuestion();
            } else {
                gameOver()
                return;
            }
        }


        function checkAnswer(userAnswer, correctAnswer) {
            return (optionsKeyArr[userAnswer] === correctAnswer);
        }

        function gameOver() {
            container.innerHTML = `<p>You Lose! You got a total of ${totalCorrectQuestions} right.</p>`;
        }

        function gameOverYouWin() {
            container.innerHTML = `<p>YOU WIN! You got a total of ${totalCorrectQuestions} right.</p>`
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