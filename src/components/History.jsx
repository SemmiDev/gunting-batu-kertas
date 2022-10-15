import { useState, useEffect } from 'react';

export default function History() {
    const history = JSON.parse(localStorage.getItem('winnerHistory')); // stack
    if (!history) {
        window.location.href = '/play';
    }

    const [totalScoreComputer, setTotalScoreComputer] = useState(0);
    const [totalScorePlayer, setTotalScorePlayer] = useState(0);

    useEffect(() => {
        history.forEach((item) => {
            if (item.winner === 'Komputer') {
                setTotalScoreComputer((prev) => prev + 1);
            } else {
                setTotalScorePlayer((prev) => prev + 1);
            }
        });
    }, []);

    const [no, setNo] = useState(1);

    const handleHome = () => {
        localStorage.removeItem('winnerHistory');
        localStorage.removeItem('playerName');
        window.location.href = '/';
    };

    function formatWaktu(waktu) {
        // 2021-08-20T08:00:00.000Z -> 20/08/2021 15:00:00
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

/*
index - x = 1
-x = 1 - index
x = -(1-index)

10 - 1
9 - 2
8 - 3
    10 - (9) = 1
    9 - (7) = 2
    8 - (5) = 3

*/
