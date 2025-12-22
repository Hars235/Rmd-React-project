
import axios from 'axios';

// Mimic the frontend request
const API_URL = "https://reachmydoctor.in/api/v1/autocomplete/get_localities";

async function testLocalitySearch(city, term) {
    console.log(`Searching for '${term}' in '${city}'...`);
    try {
        const payload = {
            city: city,
            search_term: term
        };
        
        // Use standard POST with fetch-like behavior (JSON body vs text/plain mentioned in service?)
        // Service says "Content-Type": "text/plain" and body JSON.stringify.
        // Axios usually sends application/json by default.
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

// Node.js doesn't have fetch by default in older versions, using axios if needed or assuming node 18+.
// I'll use a simple node-fetch or similar if available, or just standard https module if I want to be safe, 
// but since I have 'run_command' I can use 'curl'.
// Actually, I'll essentially write a minimal script using 'https' to avoid deps if possible, 
// OR just use the 'run_command' to run a curl or node snippet.
// Trying node 18+ style fetch.

testLocalitySearch("Bengaluru", "Banashankari");
