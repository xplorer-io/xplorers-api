import { WebClient, ErrorCode } from "@slack/web-api";


interface FetchSlackUserParams {
    userId?: string;
    email?: string;
    userName?: string;
}

interface SlackUserProfile {
    id?: string;
    first_name?: string;
    last_name?: string;
    title?: string;
    email?: string;
}

export async function fetchSlackUser({
    userId,
    email,
    userName,
}: FetchSlackUserParams): Promise<SlackUserProfile | null> {
    try {
        const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

        let userInfo;

        if (userId) {
            const { user } = await slackClient.users.info({ user: userId });
            userInfo = user;
        } else if (email) {
            const { user } = await slackClient.users.lookupByEmail({ email });
            userInfo = user;
        } else if (userName) {
            const { members } = await slackClient.users.list({});
            userInfo = members?.find((member: any) => member.name === userName);
        }

        if (!userInfo) {
            return null;
        }

        return {
            id: userInfo.id,
            first_name: userInfo.profile?.first_name,
            last_name: userInfo.profile?.last_name,
            title: userInfo.profile?.title,
            email: userInfo.profile?.email,
        };
    } catch (error: any) {
        if (
            error.code === ErrorCode.PlatformError &&
            error.data.error === "users_not_found"
        ) {
            console.log(`User not found: ${error.message}`);
            return null;
        }
        console.error(`Error fetching Slack user: ${error.message}`);
        throw error;
    }
}