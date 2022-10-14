import { useState, useEffect } from 'react';

export function Form(props) {
    function handleInputPlayerName(event) {
        event.preventDefault();
        props.setPlayerName(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        props.setIsPlaying(true);
    }

    return (
        <div className='border border-1 p-10 rounded-2xl shadow-md shadow-red-100'>
            <form className='flex flex-col gap-y-2 max-w-2xl' onSubmit={handleSubmit} method='POST'>
                <h1 className='text-2xl text-white font-sans mb-8 text-center italic'>Siap untuk bermain?</h1>
                <input
                    type={'text'}
                    placeholder={'Masukkan nama anda'}
                    name={'name'}
                    autoComplete={'off'}
                    required={true}
                    onChange={handleInputPlayerName}
                    className={
                        'px-3 py-2 border rounded-xl transition-all duration-300 font-bold focus:outline-none focus:bg-yellow-200 focus:ring-1 focus:ring-violet-800'
                    }
                />
                <button className='bg-violet-500 text-white px-3 py-2 rounded-xl transition-all duration-300 hover:bg-violet-600' type='submit'>
                    Mulai
                </button>
            </form>
        </div>
    );
}

export default function App() {
    const [playerName, setPlayerName] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (isPlaying) {
            localStorage.setItem('playerName', playerName);
            window.location.href = '/play';
        }
    }, [isPlaying]);

    return (
        <main className='bg-primary min-h-screen w-full antialiased'>
            <div className='flex flex-col md:flex-row justify-center md:pt-24 items-center'>
                <div>
                    <img src='/batu-gunting-kertas.png' className='h-25 w-25' />
                </div>
                <div className='m-5'>
                    <Form setPlayerName={setPlayerName} setIsPlaying={setIsPlaying} />
                </div>
            </div>
        </main>
    );
}

export const PlayGame = () => {
    const getPlayerName = localStorage.getItem('playerName');
    if (!getPlayerName) {
        window.location.href = '/';
    }

    const upperFisrtLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const [playerName, setPlayerName] = useState(upperFisrtLetter(getPlayerName));

    // save history into stack
    const [winnerHistory, setWinnerHistory] = useState([]);

    const computerPic = '/computer-mikir.png';
    const randomPicURL = ['/batu.png', '/gunting.png', '/kertas.png'];

    // first load get playername from localstorage

    const [playerScore, setPlayerScore] = useState(0);
    const [compScore, setCompScore] = useState(0);

    const [playerChoice, setPlayerChoice] = useState('');
    const [compChoice, setCompChoice] = useState(computerPic);

    const [winner, setWinner] = useState('');

    const choiceMap = {
        batu: '/batu.png',
        gunting: '/gunting.png',
        kertas: '/kertas.png',
    };

    const handlePlayerChoice = (choice) => {
        setPlayerChoice(choiceMap[choice]);
        const randomChoice = randomPicURL[Math.floor(Math.random() * randomPicURL.length)];
        setCompChoice('');
        // set computer choice after random second 1s
        // ecek-ecek mikir selama 1 detik hehehhe
        setTimeout(() => {
            setCompChoice(randomChoice);
        }, 500);
    };

    // use effect for compCHoice and playerChoice
    useEffect(() => {
        if (playerChoice && compChoice) {
            if (playerChoice === compChoice) {
                setWinner('tak ade pemenang doo.. draw.. hahhaha');
            } else if (playerChoice === choiceMap.batu && compChoice === choiceMap.gunting) {
                setWinner(playerName);
                setPlayerScore((prev) => prev + 1);
                setWinnerHistory((prev) => [...prev, playerName]);
            } else if (playerChoice === choiceMap.gunting && compChoice === choiceMap.kertas) {
                setWinner(playerName);
                setPlayerScore((prev) => prev + 1);
                setWinnerHistory((prev) => [...prev, playerName]);
            } else if (playerChoice === choiceMap.kertas && compChoice === choiceMap.batu) {
                setWinner(playerName);
                setPlayerScore((prev) => prev + 1);
                setWinnerHistory((prev) => [...prev, playerName]);
            } else {
                setWinner('Komputer');
                setCompScore((prev) => prev + 1);
                setWinnerHistory((prev) => [...prev, 'Komputer']);
            }
        }
    }, [playerChoice, compChoice]);

    const handleButtonClick = () => {
        localStorage.setItem('winnerHistory', JSON.stringify(winnerHistory));
        window.location.href = '/history';
    };

    return (
        <>
            <main className='bg-primary min-h-screen w-full antialiased  px-48 pt-20'>
                <div className='flex justify-center mb-5'>
                    <button
                        className='bg-sky-500 border-2 text-white px-3 py-2 rounded-2xl transition-all duration-300 hover:bg-violet-600'
                        onClick={handleButtonClick}>
                        Lihat History
                    </button>
                </div>
                <div className='grid grid-cols-2 gap-5'>
                    <div className='bg-violet-400 rounded-xl p-4'>
                        <div className='flex flex-col items-center gap-y-5'>
                            <div className='flex flex-col items-start'>
                                <h1 className='text-2xl font-bold'>{playerName}</h1>
                                <h1 className='text-2xl font-bold'>Score : {playerScore}</h1>
                            </div>
                            <div className='flex gap-x-2 items-center'>
                                <img
                                    src='/batu.png'
                                    className='h-28 w-20 hover:cursor-pointer hover:scale-125 transition-all duration-150 ease-in-out'
                                    onClick={() => handlePlayerChoice('batu')}
                                />
                                <img
                                    src='/kertas.png'
                                    className='h-28 w-20 hover:cursor-pointer hover:scale-125 transition-all duration-150 ease-in-out'
                                    onClick={() => handlePlayerChoice('kertas')}
                                />
                                <img
                                    src='/gunting.png'
                                    className='h-28 w-20 hover:cursor-pointer hover:scale-125 transition-all duration-150 ease-in-out'
                                    onClick={() => handlePlayerChoice('gunting')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='bg-violet-400 rounded-xl p-4'>
                        <div className='flex flex-col items-center gap-y-5'>
                            <div className='flex flex-col items-start'>
                                <h1 className='text-2xl font-bold'>Computer</h1>
                                <h1 className='text-2xl font-bold'>Score: {compScore}</h1>
                            </div>
                            <div className='flex gap-x-2'>
                                <img src={compChoice} alt={'Lagi mikir hehehe ...'} className='h-24 hover:cursor-pointer object-cover' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col mt-10 text-white text-2xl items-center'>
                    <div className='flex justify-center gap-x-2 items-center'>
                        <img src={playerChoice} alt='' className='block h-28' />
                        <span className='inline-block p-3 text-red-400'>VS</span>
                        {compChoice === computerPic ? '' : <img src={compChoice} alt='' className='block h-28' />}
                    </div>

                    <h1 className='text-center'>Pemenangnya adalah</h1>
                    {compChoice !== computerPic && playerChoice !== '' ? (
                        <h1 className='text-center mt-4 text-4xl font-bold text-green-500'>{winner}</h1>
                    ) : (
                        ''
                    )}
                </div>
            </main>
        </>
    );
};

export const History = () => {
    const history = JSON.parse(localStorage.getItem('winnerHistory'));
    if (!history) {
        window.location.href = '/play';
    }

    const [totalScoreComputer, setTotalScoreComputer] = useState(0);
    const [totalScorePlayer, setTotalScorePlayer] = useState(0);

    useEffect(() => {
        history.forEach((item) => {
            if (item === 'Komputer') {
                setTotalScoreComputer((prev) => prev + 1);
            } else {
                setTotalScorePlayer((prev) => prev + 1);
            }
        });
    }, []);

    const handleHome = () => {
        localStorage.removeItem('winnerHistory');
        localStorage.removeItem('playerName');
        window.location.href = '/';
    };

    return (
        <>
            <main className='bg-primary min-h-screen w-full antialiased px-48 pt-20 text-white'>
                {/* cool table  */}
                <div className='flex flex-col items-center'>
                    <h1 className='text-3xl font-bold mb-5'>History</h1>
                    <div className='flex gap-x-2'>
                        <button
                            className='bg-red-500 text-white px-3 py-2 rounded-xl transition-all duration-300 hover:bg-red-600'
                            type='button'
                            onClick={handleHome}>
                            Home
                        </button>
                    </div>

                    <table className='mt-10'>
                        <thead>
                            <tr>
                                <th className='px-4 py-2'>No</th>
                                <th className='px-4 py-2'>Pemenang</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, index) => (
                                <tr key={index}>
                                    <td className='border px-4 py-2'>{index + 1}</td>
                                    <td className='border px-4 py-2'>{item}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className='flex justify-center gap-x-5 mt-10'>
                        <div className='flex flex-col items-center'>
                            <h1 className='text-2xl font-bold'>Total Score</h1>
                            <h1 className='text-2xl font-bold'>Player : {totalScorePlayer}</h1>
                            <h1 className='text-2xl font-bold'>Computer : {totalScoreComputer}</h1>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};
