import { useState ,useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [ posts , setPosts ] = useState([])
  const [ postToDelete , setPostToDelete ] = useState(null)

  const openDeleteModal = (id) => {
    const post = posts.find(item => item.id === id);
    setPostToDelete(post);
  }  

  useEffect(() => {
    axios
         .get('https://jsonplaceholder.typicode.com/posts')
         .then((response)=> {
            // console.log(response.data);
            setPosts(response.data);
         })
         .catch((err) => {
          console.log(err.message);
       });
  }, [])

  const deletePost = (id) => {
      axios
           .delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
           .then((response) => {
              if (response.status === 200) {
                setPosts(
                  posts.filter((post) => {
                  return post.id !== id;
                  })
                );
                toast.error("Post Deleted!", {
                  position: "top-right",
                  autoClose: 2000,
                  theme: "colored",
                  icon: () => <img className='invert' src="/icons/delete.png" />
              });
              setPostToDelete(null);
              }else{
                toast.error("Failed to delete post. Please try again.", {
                  position: "top-right",
                  autoClose: 2000,
                  theme: "colored",
                });
              }   
           })
           .catch((err) => {
            toast.error("An error occurred. Please try again.", {
              position: "top-right",
              autoClose: 2000,
              theme: "colored",
            })
            console.log(err.message)
          })
  }
  // bg-[rgb(243,242,242)]
  // bg-[#faf7f1]
  return (
    <>
     <ToastContainer/>
    <div className='bg-[rgb(243,242,242)]'>

      <h1 className='text-center font-bold text-[30px]'>Some handpicked posts to display</h1>
      <div className='mt-20 pl-10 flex max-w-[100%] gap-14 flex-wrap items-center'>
            {posts.map((user) => {
              return (
                 <div className='w-[350px] flex flex-col items-center text-center gap-4 bg-white p-6 rounded-tl-[80px] rounded-br-[60px]' key={user.id}>
                     <p><span className='font-bold'>User Id : </span><span className='text-[rgba(92,101,116,1)]'>{user.userId}</span></p>
                     <p className='font-bold'>{user.title}</p> 
                     <p className='text-[rgba(92,101,116,1)]'>{user.body}</p>
                     <div >
                     <button className='!border !border-red-500 !rounded-tl-[15px] !rounded-br-[15px]  !text-red-500 w-[80px]  p-2 hover:bg-red-500 hover:!text-white' onClick={() => openDeleteModal(user.id)}>Delete</button>
                     </div>
                 </div>
              );
           })}
          {postToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-8 rounded-lg w-full max-w-md">
                    <div className="mb-4">
                      <h1 className="text-xl font-bold text-center text-red-500">Confirm to delete post</h1>
                    </div>
                    <div className="mb-6">
                      <p className='text-center'><span className='font-bold text-gray-800 '>UserId</span>: {postToDelete.userId}</p>
                      <div className='flex flex-col gap-2 text-center justify-center mt-4'>
                        <p><span className='font-bold text-gray-800'>Title</span>: {postToDelete.title}</p>
                        <p><span className='font-bold text-gray-800'>Body</span>: {postToDelete.body}</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <button className="btn btn-secondary bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded" onClick={() => setPostToDelete(null)}>Close</button>
                      <button className="btn btn-primary bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded" onClick={() => deletePost(postToDelete.id)}>Delete</button>
                    </div>
                  </div>
                </div>
            )}

      </div>
            </div>
    </>
  )
}


export default App
