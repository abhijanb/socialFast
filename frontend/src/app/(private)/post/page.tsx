"use client";

import { useCreatePost } from "./_feature/useCreatePost";


const Page = () => {
    const { submit, errors, register, serverError, isLoading } = useCreatePost();
    return (
        <div>
            <h1>Post Page</h1>
            <p>This is the post page content.</p>
            {serverError && <p role="alert" className="text-red-500">{serverError}</p>}
            <form onSubmit={submit}>
                <label htmlFor="title">Post Title:</label>
                <input type="text" id="title"  {...register("title")} />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                <br />
                <label htmlFor="text">Post Content:</label>
                <textarea id="text"  {...register("text")}></textarea>
                {errors.text && <p className="text-red-500">{errors.text.message}</p>}
                <br />
                <label htmlFor="image">Post Image:</label>
                <input type="file" id="image" accept="image/jpeg,image/png,image/webp" {...register("image")} />
                {errors.image && <p className="text-red-500">{errors.image.message}</p>}
                <br />
                <button type="submit" disabled={isLoading}>Submit</button>
            </form>
        </div >
    )
}

export default Page
