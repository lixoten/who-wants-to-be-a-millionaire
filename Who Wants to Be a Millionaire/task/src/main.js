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
        let hintUsed = false;

        let correctAnswer = '';


        //const option = ['A', 'B', 'C', 'D'];
        let optionsKeyArr = ['A', 'B', 'C', 'D'];


        function setButtons() {
            container.textContent = ''; // Clear container here, First think to use it

                 const hintBtn = document.createElement("button");
                 hintBtn.textContent = `50/50`;
                 hintBtn.id = "fiftyFiftyBtn";
                 hintBtn.addEventListener('click', () => {
                     hintUsed = true;
                     function shuffleArray(array) {
                         for (let i = array.length - 1; i > 0; i--) {
                             const j = Math.floor(Math.random() * (i + 1));
                             [array[i], array[j]] = [array[j], array[i]];
                         }
                     }

                     // the ... makes a new copy, not a reference
                     let tmpArr = [...optionsKeyArr];
                     shuffleArray(tmpArr);

                     let tmpIncorrectCount = 0;
                     tmpArr.forEach((item, index) => {
                         if (item !== correctAnswer && tmpIncorrectCount < 2) {
                             const optionElement = document.getElementById(item);
                             if (optionElement) {
                                 const element = document.getElementById(item)

                                 // the test specs said not to remove from DOM.
                                 //optionElement.style.display = 'none';
                                 optionElement.style.visibility = 'hidden';
                                 //if (element && element.parentNode) {
                                 //    element.remove();
                                 //    //data[questionIndex]['question'];
                                 //}
                                 tmpIncorrectCount++;
                             }
                             tmpArr.splice(index, 1)
                             //cnt ++;
                         }
                     });
                     //hintBtn.style.visibility = 'hidden';
                     //return;
                     if (hintUsed) {
                         hintBtn.style.display = 'none';
                         // hintBtn.style.visibility = 'hidden';
                     }
                 });

                if (hintUsed) {
                    hintBtn.style.display = 'none';
                }
                 container.appendChild(hintBtn);
            //}

            const skipBtn = document.createElement("button");
            skipBtn.textContent = `Skip the question`;
            skipBtn.id = "skipTheQuestionBtn";
            skipBtn.addEventListener('click', () => {
                questionIndex++;
            //     totalSkippedQuestions++;
                processQuestion();
            });
            container.appendChild(skipBtn);
        }


        function dispQuestion(question) {
            const p = document.createElement("p");
            p.textContent = (totalAskedQuestions + 1) + ". " + question;
            p.id = "question";
            container.appendChild(p);

        }

        function dispOptions(optionsArr, answer) {
            totalAskedQuestions++;

            const ol = document.createElement("ol");
            ol.id = "options";
            container.appendChild(ol);

            optionsArr.forEach(function (optionText, index) {
                const li = document.createElement("li");

                //li.textContent = `${optionsArr[index]}. ${optionText}`;
                li.textContent = `${optionsArr[index]}. ${data[questionIndex][optionsArr[index]]}`;
                li.id = optionsArr[index]; // We need the ID so we can hide item on 50/50

                li.classList.add("opt");
                li.addEventListener('click', () => {
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
            //container.textContent = ''; // Clear container

            //hintBtn.style.visibility = 'hidden';
            //setButtons();
            const btn1  = document.getElementById("fiftyFiftyBtn");
            btn1.style.display = "none";
            const btn2  = document.getElementById("skipTheQuestionBtn");
            btn2.style.display = "none";
            const question  = document.getElementById("question");
            question.style.display = "none";
            const options  = document.getElementById("options");
            options.style.display = "none";


            const p = document.createElement("p");
            p.textContent = "You Lose! " + `You got a total of ${totalCorrectQuestions} right.`;
            container.appendChild(p);
        }

        function gameOverYouWin() {
            //container.textContent = ''; // Clear container
            const btn1  = document.getElementById("fiftyFiftyBtn");
            btn1.style.display = "none";
            const btn2  = document.getElementById("skipTheQuestionBtn");
            btn2.style.display = "none";
            //const question  = document.getElementById("question");
            //question.style.display = "none";
            //const options  = document.getElementById("options");
            //options.style.display = "none";

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

            correctAnswer = answer;

            setButtons();
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