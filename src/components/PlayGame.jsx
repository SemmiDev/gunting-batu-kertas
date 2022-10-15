import { useState, useEffect } from 'react';

// PlayGame akan di eksekusi ketika url `/play` di akses
export default function PlayGame() {
    // kita akan mengambil nama player dari local storage yg sebelumnya sudah kita simpan ketika user memulai permainan
    const getPlayerName = localStorage.getItem('playerName');
    // jika player name tidak ada, maka kita akan mengarahkan user ke halaman `/`, jadi user tidak bisa langsung akses halaman `/play`
    if (!getPlayerName) {
        // kita gunakan window.location.href agar otomatis browser akan mengarahkan user ke halaman `/`
        window.location.href = '/';
    }

    // upperFisrtLetter cuma untuk mengubah huruf pertama menjadi huruf besar, biar bagus aja hihihi
    const upperFisrtLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    // `playerName` yang kita ambil dari local storage, kita ubah huruf pertamanya menjadi huruf besar, dan kita simpan dalam state `playerName`
    const [playerName, setPlayerName] = useState(upperFisrtLetter(getPlayerName));

    // ini kita gunakan untuk menyimpan nilai pilihan player, defaultnya adalah string kosong []
    // kita gunakan ADT stack yang dibuat dari array
    const [counter, setCounter] = useState(1);
    const [winnerHistory, setWinnerHistory] = useState([]);

    // computerPic adalah url gambar yang akan di tampilkan di halaman play untuk si komputer
    const computerPic = '/computer-mikir.png';
    // playerPic adalah kumpulan gambar yang akan di random
    const randomPicURL = ['/batu.png', '/gunting.png', '/kertas.png'];

    // ini untuk menyimpan score player deaultny adalah 0
    const [playerScore, setPlayerScore] = useState(0);
    // ini untuk menyimpan score komputer defaultnya adalah 0
    const [compScore, setCompScore] = useState(0);

    // ini untuk menyimpan pilihan player, defaultnya adalah string kosong
    const [playerChoice, setPlayerChoice] = useState('');
    // ini untuk menyimpan pilihan komputer, defaultnya adalah string kosong
    const [compChoice, setCompChoice] = useState(computerPic);

    // ini untuk menyimpan pemenang, defaultnya adalah string kosong
    const [winner, setWinner] = useState('');

    // ini untuk menyimpan nama pilihan dan url gambar nya
    const choiceMap = {
        batu: '/batu.png',
        gunting: '/gunting.png',
        kertas: '/kertas.png',
    };

    // handlePlayerChoice adalah fungsi yang akan di eksekusi ketika user memilih pilihan nya (batu, gunting, atay kertas)
    function handlePlayerChoice(choice) {
        // kita akan mengambil url gambar dari choiceMap berdasarkan pilihan player
        // contohnya user memilih batu, maka kita akan ambil url nya /batu.png
        // dan ketika user memilih gunting, maka kita akan ambil url nya /gunting.png
        // dan ketika user memilih kertas, maka kita akan ambil url nya /kertas.png
        setPlayerChoice(choiceMap[choice]);

        // kita akan mengambil pilihan komputer secara random dari array randomPicURL
        const randomChoice = randomPicURL[Math.floor(Math.random() * randomPicURL.length)];
        // mula-mula kita kosongkan pilihan komputer
        setCompChoice('');

        // kita akan menunggu 500 millisecond untuk ecek2 nya komputer mikir
        setTimeout(() => {
            // lalu kita akan set pilihan komputer
            setCompChoice(randomChoice);
        }, 500);
    }

    // use effect untuk mengecek pemenang nya
    useEffect(() => {
        if (playerChoice && compChoice) {
            if (playerChoice === compChoice) {
                // jika pilihan player sama dengan pilihan komputer, maka kita akan set status pemenang nya menjadi 'draw'
                setWinner('tak ade pemenang doo.. draw.. hahhaha');
            } else if (playerChoice === choiceMap.batu && compChoice === choiceMap.gunting) {
                // set pemnenang nya menjadi player
                setWinner(playerName);
                // skor player akan bertambah 1
                setPlayerScore((prev) => prev + 1);
                // kita masukkan history pemenang nya ke dalam ADT stack
                // set objek pemenang nya (pemenang, tanggal sekarang)
                setCounter((prev) => prev + 1);
                setWinnerHistory((prev) => [
                    ...prev,
                    {
                        no: counter,
                        winner: playerName,
                        tanggal: new Date(),
                    },
                ]);
            } else if (playerChoice === choiceMap.gunting && compChoice === choiceMap.kertas) {
                setWinner(playerName);
                setCounter((prev) => prev + 1);
                setPlayerScore((prev) => prev + 1);
                setWinnerHistory((prev) => [
                    ...prev,
                    {
                        no: counter,
                        winner: playerName,
                        tanggal: new Date(),
                    },
                ]);
            } else if (playerChoice === choiceMap.kertas && compChoice === choiceMap.batu) {
                setWinner(playerName);
                setPlayerScore((prev) => prev + 1);
                setCounter((prev) => prev + 1);
                setWinnerHistory((prev) => [
                    ...prev,
                    {
                        no: counter,
                        winner: playerName,
                        tanggal: new Date(),
                    },
                ]);
            } else {
                setWinner('Komputer');
                setCompScore((prev) => prev + 1);
                setCounter((prev) => prev + 1);
                setWinnerHistory((prev) => [
                    ...prev,
                    {
                        no: counter,
                        winner: 'Komputer',
                        tanggal: new Date(),
                    },
                ]);
            }
        }
    }, [playerChoice, compChoice]);

    // handleButtonClick adalah fungsi yang akan di eksekusi ketika user menekan tombol `history`
    function handleButtonClick() {
        // kita akan memasukkan ADT stack winnerHistory ke dalam local storage
        localStorage.setItem('winnerHistory', JSON.stringify(winnerHistory));
        // dan kita akan mengarahkan user ke halaman `/history`
        window.location.href = '/history';
    }

    return (
        <>
            <main className='bg-primary min-h-screen w-full antialiased  px-48 pt-20'>
                <div className='flex justify-center mb-5'>
                    <button
                        className='bg-sky-500 border-2 text-white px-3 py-2 rounded-2xl transition-all duration-300 hover:bg-violet-600'
                        // ketika user menekan tombol `history`, maka fungsi handleButtonClick akan di eksekusi
                        onClick={handleButtonClick}>
                        Lihat History
                    </button>
                </div>
                <div className='grid grid-cols-2 gap-x-5'>
                    <div className='bg-violet-400 rounded-xl p-4'>
                        <div className='flex flex-col items-center gap-y-5'>
                            <div className='flex flex-col items-start'>
                                {/* disini kita tampilkan player name */}
                                <h1 className='text-2xl font-bold'>{playerName}</h1>
                                {/* disini kita tampilkan player score */}
                                <h1 className='text-2xl font-bold'>Score : {playerScore}</h1>
                            </div>
                            <div className='flex gap-x-2 items-center'>
                                <img
                                    src='/batu.png'
                                    className='h-28 w-20 hover:cursor-pointer hover:scale-125 transition-all duration-150 ease-in-out'
                                    // ketika user menekan gambar batu, maka fungsi handlePlayerChoice akan di eksekusi
                                    onClick={() => handlePlayerChoice('batu')}
                                />

                                <img
                                    src='/kertas.png'
                                    className='h-28 w-20 hover:cursor-pointer hover:scale-125 transition-all duration-150 ease-in-out'
                                    // ketika user menekan gambar kertas, maka fungsi handlePlayerChoice akan di eksekusi
                                    onClick={() => handlePlayerChoice('kertas')}
                                />

                                <img
                                    src='/gunting.png'
                                    className='h-28 w-20 hover:cursor-pointer hover:scale-125 transition-all duration-150 ease-in-out'
                                    // ketika user menekan gambar gunting, maka fungsi handlePlayerChoice akan di eksekusi
                                    onClick={() => handlePlayerChoice('gunting')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='bg-violet-400 rounded-xl p-4'>
                        <div className='flex flex-col items-center gap-y-5'>
                            <div className='flex flex-col items-start'>
                                <h1 className='text-2xl font-bold'>Computer</h1>
                                {/* menampilkan score komputer */}
                                <h1 className='text-2xl font-bold'>Score: {compScore}</h1>
                            </div>
                            <div className='flex gap-x-2'>
                                {/* menampilkan gambar komputer lagi mikir */}
                                <img src={compChoice} alt={'Lagi mikir nich hehehe ...'} className='h-24 hover:cursor-pointer object-cover' />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col mt-10 text-white text-2xl items-center'>
                    <div className='flex justify-center gap-x-2 items-center'>
                        {/* menampilkan apa yang user pilih */}
                        <img src={playerChoice} alt='' className='block h-28' />
                        <span className='inline-block p-3 text-red-400'>VS</span>
                        {/* mule-mule kita tampilkan kosong aja dlu, kalo udah ada baru kita tampilkan pilihan si komputer */}
                        {compChoice === computerPic ? '' : <img src={compChoice} alt='' className='block h-28' />}
                    </div>

                    <h1 className='text-center'>Pemenangnya adalah</h1>
                    {/* kalau kmoputer udah memilih dan player udah memilih makan kita akan manggil si winner atau pemenangnya */}
                    {compChoice !== computerPic && playerChoice !== '' ? (
                        // menampilkan pemenang
                        <h1 className='text-center mt-4 text-4xl font-bold text-green-500'>{winner}</h1>
                    ) : (
                        ''
                    )}
                </div>
            </main>
        </>
    );
}
