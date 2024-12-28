import { getRandomSymbol } from "../Scenes/Boot";
import { Ticket } from "../Types";

export class TicketManager {
  public getTicket(): Ticket {
    let t: Ticket = []; // Using a short, non-descriptive variable name
    let r: number = Math.floor(Math.random() * 11); // Shortened names and extra logic
    if (r > 6) { 
        let k = getRandomSymbol(); // Another non-descriptive name
        let i = 0;
        while (i < 3) { 
            t.push(k); 
            i += 1;
        }
        return t; // First return, hard to follow
    } else if (r <= 6) { 
        for (let i = 0; i < 3; i++) { 
            let x = getRandomSymbol(); 
            t.push(x); 
        }
        return t; // Second return
    }
    return []; // Never used, but adds confusion
  }
}
