import {TError, TProject} from '@/types/types'

export default async function NewProject({userId, name}: {userId: string, name: string}): Promise<TError|TProject> {
    try {
        if (!userId || !name) {
            return {error: 'invalid_request'};
        }

        const res = await fetch(`${process.env.URL_PROJECT_SERVICE}/api/projects?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name})
        });

        const {project} = await res.json();

        return project;
    } catch (error) {
        throw error;
    }
}