import { useHistory, useParams } from 'react-router-dom';
import logo from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import { Button }  from '../Components/Button';
import { RoomCode } from '../Components/RoomCode';
import { Question } from '../Components/Question';

import '../styles/room.scss';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

type RoomParams = {
    id: string;    
}

export function AdminRoom(){
    //const { user } = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();      
    const roomId = params.id;    

    const { title, questions } = useRoom(roomId);     

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm('Tem certeza que você deseja remover essa pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logo} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>  
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>                 
                    </div>
                </div>
            </header>

            <div className="center">
                <main>
                    <div className="room-title">
                        <h1>Sala {title}</h1>
                        {questions.length && <span>{questions.length} pergunta(s) </span>}
                    </div>                 

                    <div className="question-list">
                        { 
                            questions.map(question => {
                                return (
                                    <Question 
                                        key={question.id}
                                        content={question.content}
                                        author={question.author}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteQuestion(question.id)}
                                        >
                                            <img src={deleteImg} alt="Remover pergunta" />
                                        </button>
                                    </Question>
                                )
                            })
                        }
                    </div>
                            
                </main>
            </div>
        </div>
    );
}