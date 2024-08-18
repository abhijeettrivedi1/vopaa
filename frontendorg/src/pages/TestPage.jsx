import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import '../css/TestPage.css';

const url = import.meta.env.VITE_PYTHON_BASE_URL;

const TestPage = () => {
    const [selectedOption, setSelectedOption] = useState('story');
    const [result, setResult] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [text, setText] = useState('माझं नाव राजू आहे.');
    const [language, setLanguage] = useState('Hindi');
    const [level, setLevel] = useState(4);
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioRef = useRef(null);
    const { id } = useParams();

    useEffect(() => {
        fetchTestText();
    }, [language, level]);

    const fetchTestText = async () => {
        try {
            const response = await axios.post('/test', {
                level,
                langType: language
            });
            
            setText(response.data);
        } catch (error) {
            console.error('Error fetching test text:', error);
            toast.error('Failed to fetch test text. Please try again.');
        }
    };

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm' // Use 'audio/webm' or 'audio/ogg'
            });
            mediaRecorderRef.current.ondataavailable = (event) => {
                const blob = new Blob([event.data], { type: 'audio/webm' });
                setAudioBlob(blob);
            };
            mediaRecorderRef.current.start();
            setRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            toast.error('Failed to start recording. Please try again.');
        }
    };

    const handleStopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
    };

    const handleUploadAudio = async () => {
        if (!audioBlob) {
            toast.error('No audio recorded!');
            return;
        }

        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm'); // Save as .webm file
        formData.append('language', language);
        formData.append('text', text);

        try {
            const response = await fetch(`${url}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed with status ${response.status}`);
            }

            const data = await response.json();
            console.log('Upload response:', data);

            const gradeResponse = await fetch(`${url}/grade`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reference_text: text,
                    language
                })
            });

            if (!gradeResponse.ok) {
                throw new Error('Error while grading');
            }

            const gradeData = await gradeResponse.json();
            console.log('Grading response:', gradeData);

            if (gradeData.Message === 'Pass') {
                toast.success('Passed');
                updateStudentLevel();
            } else {
                setLevel((prevLevel) => prevLevel - 1);
                toast.error('Failed');
            }
        } catch (error) {
            console.error('Error uploading or grading audio:', error);
            toast.error('Failed to process audio. Please try again.');
        }
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const handleLevelChange = (e) => {
        setLevel(e.target.value);
    };

    const updateStudentLevel = async () => {
        try {
            const response = await axios.post('/changeStudentLevel', {
                studentId: id,
                newLevel: parseInt(level)
            });
            
            console.log('Updated student level:', response.data);
        } catch (error) {
            console.error('Error updating student level:', error);
            toast.error('Failed to update student level. Please try again.');
        }
    };

    return (
        <div className="TestPage">
            <Toaster position="bottom-center" reverseOrder={false} />
            <div className="header">
                <Link to="/students" className="back-btn">Back</Link>
            </div>
            <h1>TEST</h1>
            <div className="dropdowns">
                <div>
                    <label htmlFor="languageSelect">Select Language: </label>
                    <select id="languageSelect" value={language} onChange={handleLanguageChange}>
                        <option value="Hindi">Hindi</option>
                        <option value="English">English</option>
                    </select>
                    <label htmlFor="levelSelect">Select Level: </label>
                    <select id="levelSelect" value={level} onChange={handleLevelChange}>
                        <option value={1}>Level 1</option>
                        <option value={2}>Level 2</option>
                        <option value={3}>Level 3</option>
                        <option value={4}>Level 4</option>
                    </select>
                </div>
            </div>
            <div className="form">
                <textarea
                    value={text}
                    style={{ height: '200px', width: '500px', fontSize: '18px' }}
                    readOnly
                />
                <br />
                {recording ? (
                    <button onClick={handleStopRecording}>Stop Recording</button>
                ) : (
                    <button onClick={handleStartRecording}>Start Recording</button>
                )}
                {audioBlob && (
                    <>
                        <audio ref={audioRef} controls src={URL.createObjectURL(audioBlob)} />
                        <button onClick={handleUploadAudio}>Upload Audio</button>
                    </>
                )}
            </div>
            {result && <p>{result}, {percentage}</p>}
        </div>
    );
};

export default TestPage;
