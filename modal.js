$(document).ready(() =>{
    const year = new Date().getFullYear();
    const apiKey = '335228310c6b751750199c1a453b7347';
    //Api to get image details like sizes and logos
    const imgApi = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;

    const poster = document.querySelectorAll('.poster');

    // function openItemModal(){
    //     return new Promise((res) => {
    //         const poster = document.querySelectorAll('.poster');
    //         poster.forEach(item => {
    //             item.addEventListener('click', function(){
    //                 if(item.classList.contains('movie')){
    //                     localStorage.setItem('mediaType', `movie`)
    //                 } else{
    //                     localStorage.setItem('mediaType', `tv`)
    //                 }
    //                 localStorage.setItem('id', `${item.id}`)
    //                 //localStorage.setItem('mediaType', `${item.id}`)
    //             })
    //         })
    //         res()
    //     })
    // }

    
    poster.forEach(item => {
        item.addEventListener('click', function(){
            if(item.classList.contains('movie')){
                localStorage.setItem('mediaType', `movie`)
            } else{
                localStorage.setItem('mediaType', `tv`)
            }
            localStorage.setItem('id', `${item.id}`)
            //localStorage.setItem('mediaType', `${item.id}`)
        })
    })
    


})