import { Component, createSignal, createEffect } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import { currentSession } from '../../lib/userSessionStore'
import { useStore } from '@nanostores/solid'
import type { AuthSession } from '@supabase/supabase-js'
import { SITE }  from '../../config'

export const EditProfileButton: Component = () => {
    const [profileType, setProfileType] = createSignal<"Client"|"Provider"|null>(null)
    const [user, setUser] = createSignal<AuthSession | null>(null)


    //rewrite to check if we are on the client or provider profile page and redirect accordingly
    const editRedirect = async (e: SubmitEvent) => {
        e.preventDefault()

        try {
            setUser(useStore(currentSession)())
            console.log("window.location.href: " + window.location.href)
            console.log(SITE.url + '/client/profile')
            if (window.location.href === SITE.url + '/provider/profile') {
                location.href = "/provider/editaccount"
            } else if (window.location.href === SITE.url + '/client/profile') {
                location.href = "/client/editaccount"
            } else {
                console.log(window.location.href)
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <form onSubmit={editRedirect}>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Edit Profile</button>
            </form>
        </div>
    )
}