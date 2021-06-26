import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import closeImg from '../assets/images/close.svg';

import { Button } from '../Components/Button';
import { Question } from '../Components/Question';
import { RoomCode } from '../Components/RoomCode';
import { Modal } from '../Components/Modal';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';
import { useState } from 'react';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalQuestionOpen, setIsModalQuestionOpen] = useState(false);
  const [ currentQuestionId , setCurrentQuestionId] = useState<string | undefined>('');

  const history = useHistory()
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId)

  async function handleEndRoom() {        
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  function handleModalRoomVisible(){    
    setIsModalOpen(!isModalOpen);
  }

  function handleModalQuestionVisible(questionId?: string){
    setCurrentQuestionId(questionId)    
    setIsModalQuestionOpen(!isModalQuestionOpen);
  }

  async function handleDeleteQuestion() {    
    // if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
    //   await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    // }
    await database.ref(`rooms/${roomId}/questions/${currentQuestionId}`).remove(); 
    setIsModalQuestionOpen(!isModalQuestionOpen);   
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    })
  }

  function redirectToHome(){
    history.push('');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" onClick={redirectToHome}/>
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleModalRoomVisible}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"                  
                  onClick={() => handleModalQuestionVisible(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>

      <Modal isOpen={isModalOpen} handleModalVisible={handleModalRoomVisible}>
        <div className="container-modal">
            <img src={closeImg} alt="Encerrar sala" />
            <h2>Encerrar sala</h2>
            <p>Tem certeza que você deseja encerrar esta sala? </p>
            <div>
              <button type="button" className="button button-cancel" onClick={handleModalRoomVisible}>Cancelar</button>
              <button type="button" className="button button-confirm-cancel" onClick={handleEndRoom}>Sim, encerrar</button>
            </div>
        </div>
      </Modal>

      <Modal isOpen={isModalQuestionOpen} handleModalVisible={handleModalQuestionVisible}>
        <div className="container-modal">
            <img src={closeImg} alt="Excluir pergunta" />
            <h2>Excluir pergunta</h2>
            <p>Tem certeza que você deseja excluir esta pergunta? </p>
            <div>
              <button type="button" className="button button-cancel" onClick={() => handleModalQuestionVisible()}>Cancelar</button>
              <button type="button" className="button button-confirm-cancel" onClick={handleDeleteQuestion}>Sim, excluir</button>
            </div>
        </div>
      </Modal>

    </div>
  );
}