import { FormEvent, useState, useTransition } from 'react';
import { requestFormReset } from 'react-dom';

interface FormState {
    success: boolean
    message: string | null
    errors: Record<string, string[]> | null
}

export function useFormState(
    action: (data: FormData) => Promise<FormState>,
    onSuccess?: () => Promise<void> | void,
    initialState?: FormState,
) {
    const [isPending, startTransition] = useTransition()

    const [formState, setFormState] = useState(
        initialState ?? { success: false, message: null, errors: null },
    )

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const form = event.currentTarget
        const data = new FormData(form)

        // Run the action (network/server) first, outside the transition
        const state = await action(data)

        // Then perform UI updates inside a synchronous transition callback
        startTransition(() => {
            if (state.success) {
                requestFormReset(form)
            }

            setFormState(state)
        })

        // Run optional onSuccess after the transition
        if (state.success && onSuccess) {
            await onSuccess()
        }
    }

    return [formState, handleSubmit, isPending] as const
}