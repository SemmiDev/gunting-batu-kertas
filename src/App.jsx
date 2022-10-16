import { useState, useEffect } from 'react';

// App akan di eksekusi ketika kita pertama kali menjalankan aplikasi
export default function App() {
    // `playerName` untuk menyimpan nama player, setPlayerName untuk mengubah nilai `playerName`. defaultnya adalah string kosong ''
    const [playerName, setPlayerName] = useState('');

    // `isPlaying` untuk menyimpan status apakah player sedang bermain atau tidak,
    // setIsPlaying untuk mengubah nilai `isPlaying`. defaultnya adalah false (artinya permainan belum dimulai)
    const [isPlaying, setIsPlaying] = useState(false);

    // use effect kita gunakan untuk mendeteksi perubahan pada `isPlaying` secara realtime
    useEffect(() => {
        // kalau misalkan `isPlaying` bernilai true, maka kita akan menyimpan nama player ke dalam local storage
        // dan mengarahkan user ke halaman `/play` (untuk mulai bermain)
        if (isPlaying) {
            localStorage.setItem('playerName', playerName);
            window.location.href = '/play';
        }
        // disini kita tammbahkan [isPlaying] sebagai dependency, jadi setiap kali `isPlaying` berubah, maka use effect akan dijalankan
        // kalau tidak ditambahkan, maka use effect hanya akan dijalankan sekali saja ketika component pertama kali di buat
    }, [isPlaying]);

    // ini tampilan yang akan di tampilkan ketika user belum memulai permainan
    return (
        <main className='bg-primary min-h-screen w-full'>
            <div className='flex flex-col md:flex-row justify-center md:pt-24 items-center'>
                <div>
                    {/* untuk menampilkan gambar batu-gunting-kertas dihalaman home */}
                    <img src='/batu-gunting-kertas.png' className='h-25 w-25' />
                </div>

                <div className='m-5'>
                    {/*
                        kita akan render Form input nama disini
                        kita juga memasukkan setPlayerName dan setIsPlaying sebagai props (parameter) yang akan di gunakan di Form
                        kita masukkan agar si form nya bisa mengubah nilai `playerName` dan `isPlaying` yang ada di `App`
                    */}
                    <Form setPlayerName={setPlayerName} setIsPlaying={setIsPlaying} />
                </div>
            </div>
        </main>
    );
}

// Form untuk menampilkan input nama dan tombol mulai bermain di halaman home
// `props` adalah parameter/object yang berisi semua data yang di kirimkan dari componenet pemanggil
// untuk kasus ini, kita akan menerima `setPlayerName` dan `setIsPlaying` sebagai props
// yang dikirimkan dari component App
function Form(props) {
    // handleInputPlayerName akan dijalankan ketika user mengetikkan sesuatu maka kita akan mengubah nilai `playerName` yang ada di `App`
    function handleInputPlayerName(event) {
        // kita ambil nilai dari inputan user
        props.setPlayerName(event.target.value);
    }

    // handleSubmit akan dijalankan ketika user menekan tombol mulai bermain
    function handleSubmit(event) {
        // ini untuk mencegah reload halaman ketika user menekan tombol submit
        event.preventDefault();
        // kita ubah nilai `isPlaying` menjadi true, jadi kita akan masuk ke use effect di `App`
        props.setIsPlaying(true);
    }

    return (
        <div className='border border-1 p-10 rounded-3xl shadow-lg shadow-white'>
            {/* ketika onSubmit, maka kita jalankan fungsi handleSubmit tadi */}
            <form className='flex flex-col gap-y-3 max-w-2xl' onSubmit={handleSubmit} method='POST'>
                <h1 className='text-2xl text-white font-sans mb-8 text-center italic'>
                    Siap untuk bermain <span className='text-pink-300 block'>dindaku sayang?</span>
                </h1>
                <input
                    type={'text'}
                    placeholder={'Masukkan nama dinda'}
                    autoComplete={'on'}
                    required={true}
                    // {/* ketika user menginputkan sesuatu, maka kita jalankan fungsi handleInputPlayerName tadi */}
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

// PlayGame akan di eksekusi ketika url `/play` di akses
export function PlayGame() {
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

// History akan di eksekusi ketika user mengakses halaman `/history`
export function History() {
    // pertama kita ambil data history pemenangnya dari local storage
    const history = JSON.parse(localStorage.getItem('winnerHistory'));
    // kalau tak jumpe datanya, bakal di redirect/alihkan ke halaman play
    if (!history) {
        window.location.href = '/play';
    }

    // kita bikin variable untuk nyimpen data/state total skor komputer (berapa x komputer menang)
    const [totalScoreComputer, setTotalScoreComputer] = useState(0);
    // kita bikin variable untuk nyimpen data/state total skor pemain (berapa x pemain menang)
    const [totalScorePlayer, setTotalScorePlayer] = useState(0);

    // setelah history di render dan data dari local storage didapatkan, maka
    useEffect(() => {
        // kita looping isi data history
        history.forEach((item) => {
            // kalau jumpa komputer, maka total score komputer kita tambah 1
            if (item.winner === 'Komputer') {
                setTotalScoreComputer((prev) => prev + 1);
            } else {
            // kalau tidak, maka total score player kita tambah 1
                setTotalScorePlayer((prev) => prev + 1);
            }
        });
    }, []);

    const [no, setNo] = useState(1);

    // kalau tombol home ditekan maka halaman akan diarahkan ke `/`
    const handleHome = () => {
        localStorage.removeItem('winnerHistory');
        localStorage.removeItem('playerName');
        window.location.href = '/';
    };

    // ini fungsi format waktu untuk ngubah dari 2021-08-20T08:00:00.000Z menjadi 20/08/2021 15:00:00
    function formatWaktu(waktu) {
        const date = new Date(waktu);
        const tanggal = date.getDate();
        const bulan = date.getMonth() + 1;
        const tahun = date.getFullYear();
        const jam = date.getHours();
        const menit = date.getMinutes();
        const detik = date.getSeconds();
        return `${tanggal}-${bulan}-${tahun} ${jam}:${menit}:${detik}`;
    }

    return (
        <>
            <main className='bg-primary min-h-screen w-full antialiased px-48 pt-20 text-white'>
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

                    <div className='flex justify-center gap-x-5 mt-10'>
                        <div className='flex flex-col items-center'>
                            <h1 className='text-2xl font-bold'>Total Score</h1>
                            <h1 className='text-2xl font-bold'>Player : {totalScorePlayer} kali menang</h1>
                            <h1 className='text-2xl font-bold'>Computer : {totalScoreComputer} kali menang</h1>
                        </div>
                    </div>

                    <table className='mt-10'>
                        <thead>
                            <tr>
                                <th className='px-4 py-2'>No</th>
                                <th className='px-4 py-2'>Waktu</th>
                                <th className='px-4 py-2'>Pemenang</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- history tadi kita map/loop satu persatu untuk ditampilkan dalam tabel -->
                            <!-- .reverse() kita gunakan untuk menampikan data dari atas/terakhir masuk ke historynya, karena kita pake stack (LIFO) -->
                            {history
                                .map((item, index) => (
                                    <tr key={index}>
                                        <td className='border px-4 py-2'>{index}</td>
                                        <td className='border px-4 py-2'>{formatWaktu(item.tanggal)}</td>
                                        <td className='border px-4 py-2'>{item.winner}</td>
                                    </tr>
                                ))
                                .reverse()}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
}
