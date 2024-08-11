import { exec } from 'child_process';
import util from 'util';

// Promisify exec for easier async/await usage
const execPromise = util.promisify(exec);

async function extractCDNUrl(itag: string, url: string) {
    try {
        // Create command to extract video formats
        const command = `yt-dlp -f ${itag} -g ${url}`;

        // console.log(`Executing command: ${command}`);

        // Execute the command
        const { stdout, stderr } = await execPromise(command);


        // Log output
        // if (stdout) console.log(`Output: ${stdout}`);
        if (stderr) console.error(`Error: ${stderr}`);

        console.log('Extraction complete!');
        return stdout.replace(/\n/g, '');
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getDownloadLink(tab: string, url: string) {
    return await extractCDNUrl(`${tab}`, url);
}


export async function getAudioLink(tab: string, url: string) {
    return await extractCDNUrl(tab, url);
}

export async function getVideoTitle(url: string) {
    try {
        // Create command to extract video formats
        const command = `yt-dlp ${url} --skip-download --no-warning --print title`;

        // console.log(`Executing command: ${command}`);

        // Execute the command
        const { stdout, stderr } = await execPromise(command);


        // Log output
        // if (stdout) console.log(`Output: ${stdout}`);
        if (stderr) console.error(`Error: ${stderr}`);

        console.log('Extraction complete!');
        return stdout.replace(/\n/g, '');
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getAllFormat(url: string) {
    try {
        // Create command to extract video formats
        const command = `yt-dlp  -j ${url}`;

        // console.log(`Executing command: ${command}`);

        // Execute the command
        const { stdout, stderr } = await execPromise(command);


        // Log output
        // if (stdout) console.log(`Output: ${stdout}`);
        if (stderr) console.error(`Error: ${stderr}`);

        console.log('All Formats!');
        return stdout.replace(/\n/g, '');
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function download(title: string, tag: string, aud: number, url: string) {

    try {
        const filename = new Date().getTime().toString();

        let command;
        if (url.includes('tiktok.com')) {
            command = `yt-dlp -f ${tag} ${url} -o src/downloads/"${filename}.mp4"`
        } else {
            command = tag === '18' ? `yt-dlp -f ${tag}+${aud} ${url} -o src/downloads/"${filename}.mp4"`
                : `yt-dlp -f ${tag}+${aud} ${url} -o src/downloads/"${filename}"`
        }




        // console.log(`Executing command: ${command}`);

        // Execute the command
        const { stdout, stderr } = await execPromise(command);


        // Log output
        if (stdout) console.log(`Output: ${stdout}`);
        if (stderr) console.error(`Error: ${stderr}`);

        console.log('Extraction complete!', title);
        return {
            title: `${title}.mp4`,
            filename: `${filename}.mp4`
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



// important command list

//get url from playlist & write to file
// - yt-dlp --flat-playlist -i --print-to-file url file.txt "https://www.youtube.com/playlist?list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU"

//get title from playlist
// yt-dlp https://www.youtube.com/playlist?list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU --skip-download --no-warning --print title

//print url from playlist
// yt-dlp "https://www.youtube.com/playlist?list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU"  --flat-playlist -i --print url

//get avalivale format list from url
// yt-dlp --list-formats "https://www.youtube.com/watch?v=nYAyhRAV87A"

//download youtube video with 1080q with audio
// yt-dlp -f 137+140 "https://www.youtube.com/watch?v=YsuFgqKl9Lo"