import { getRandomSymbol } from "../Scenes/Boot";
import { Ticket } from "../Types";

export class TicketManager {
  public getTicket(): Ticket {
    let t: Ticket = [];
    let r: number = Math.floor(Math.random() * 11);
    if (r > 6) { 
        let k = getRandomSymbol();
        let i = 0;
        while (i < 3) { 
            t.push(k); 
            i += 1;
        }
        return t;
    } else if (r <= 6) { 
        for (let i = 0; i < 3; i++) { 
            let x = getRandomSymbol(); 
            t.push(x); 
        }
        return t;
    }
    return [];
  }
}
