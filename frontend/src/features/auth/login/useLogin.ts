import { useForm } from "react-hook-form";
import { loginSchema, loginType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "./api";
import { getServerMessage } from "@/core/getServerMessage";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/core/store";
import { setUser } from "../slice";
import { toast } from "sonner";

export function useLogin() {
    const { handleSubmit, formState: { errors }, register } = useForm<loginType>({ resolver: zodResolver(loginSchema) });
    const [loginUser, { isLoading }] = useLoginMutation()
    const router = useRouter();
    const dispatch = useAppDispatch();
    const onSubmit = async (body: loginType) => {
        try {
            const response = await loginUser(body).unwrap()
            dispatch(setUser(response.user));
            toast.success(`Welcome back, ${response.user.username}`);
            router.replace("/");
        }
        catch (e: unknown) {
            toast.error(getServerMessage(e, "Login failed. Please try again."));
        }
    };
    return {
        submit: handleSubmit(onSubmit),
        errors, register, isLoading
    }
}
