import {TError, TProject} from '@/types/types'

export default async function GetProject({userId}: {userId: string}): Promise<TError|TProject> {
    try {
        if (!userId) {
            return {error: 'invalid_request'};
        }

        const res = await fetch(`${process.env.URL_PROJECT_SERVICE}/api/projects?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: TError | {projects: TProject[]} = await res.json();
        if (isError(data)) {
            return data;
        }

        return data.projects[0];
    } catch (error) {
        throw error;
    }
}

function isError(data: TError | {projects: TProject[]}): data is TError {
    return !!(data as TError).error;
}  