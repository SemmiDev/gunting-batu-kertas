import { useState, useEffect } from 'react';

// App akan di eksekusi ketika kita menjalankan aplikasi
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

// Form untuk menampilkan input nama dan tombol mulai bermain
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
