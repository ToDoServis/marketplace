import { Component, createSignal, createEffect } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import { currentSession } from '../../lib/userSessionStore'
import { useStore } from '@nanostores/solid'
import type { AuthSession } from '@supabase/supabase-js'

export const ProviderProfileButton: Component = () => {
    const [providerProfile, setProviderProfile] = createSignal(null)
    const [user, setUser] = createSignal<AuthSession | null>(null)

    const providerRedirect = async (e: SubmitEvent) => {
        e.preventDefault()

        try {
            setUser(useStore(currentSession)())

            if (user() === null) {
                alert("Please sign in to access this page.")
                location.href = "/login"
            } else {
                const { data: provider, error: providerError } = await supabase.from('providers').select('*').eq('user_id', user()!.user.id)
                if (providerError) {
                    console.log("Error: " + providerError.message)
                } else if (!provider.length) {
                    alert("You do not have a provider account please create one to view your provider profile.")
                    location.href = "/provider/createaccount"
                } else {
                    location.href = "/provider/profile"
                }

            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <form onSubmit={providerRedirect}>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">My Provider Profile</button>
            </form>
        </div>
    )
}