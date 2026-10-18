

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export function Form() {

    const { register, reset, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            email: ""
        }
    });

    return (
        <form onSubmit={handleSubmit((val) => {
            console.log(val);
        })} className='border w-1/2  border-border   m-2 p-10 bg-white/10  rounded-xl'>
            <FieldGroup className=''>
                <Field>
                    <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
                    <Input {...register("name", { required: "name is required", })} id="fieldgroup-name" placeholder="Jordan Lee" />
                    {errors.name && <p className='text-warning'>{errors.name.message}</p>}
                </Field>
                <Field>
                    <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                    <Input
                        {...register("email")}
                        id="fieldgroup-email"
                        type="email"
                        placeholder="name@example.com"
                    />
                    <FieldDescription>
                        We&apos;ll send updates to this address.
                    </FieldDescription>
                </Field>
                <Field orientation="horizontal">
                    <Button type="reset" onClick={() => {
                        reset();
                    }} variant="outline">
                        Reset
                    </Button>
                    <Button type="submit">Submit</Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
