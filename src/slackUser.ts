import { WebClient, ErrorCode } from "@slack/web-api";
import { Request, Response } from "express";

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

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

export const fetchSlackUserRoute = async (req: Request, res: Response) => {
    const userId = req.query.userId as string | undefined;
    const email = req.query.userEmail as string | undefined;
    const userName = req.query.userName as string | undefined;

    if (!userId && !email && !userName) {
        res.status(400).send(
            "At least one of userId, userEmail, or userName must be provided"
        );
        return;
    }

    try {
        const user = await fetchSlackUser({ userId, email, userName });

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        res.send(user);
    } catch (error) {
        console.error(`Something went wrong: ${error}`);
        res.status(500).send("Internal Server Error");
    }
};

export const fetchSlackUserStatusRoute = async (
    req: Request,
    res: Response
) => {
    const email = req.query.userEmail as string | undefined;

    if (!email) {
        res.status(400).send("userEmail must be provided");
        return;
    }

    try {
        const user = await fetchSlackUser({ email });

        if (!user) {
            return res.json({ isActive: false });
        }
        console.log(`User: ${user.first_name} exists in slack`);
        res.json({ isActive: true });
    } catch (error) {
        console.error(`Something went wrong: ${error}`);
        res.status(500).send("Internal Server Error");
    }
};
