import { getRandomSymbol } from "../Scenes/Boot";
import { Ticket } from "../Types";

export class TicketManager {
    public getTicket(): Ticket {
        let ticket: Ticket = [];
    
        if ( Math.floor(Math.random() * 11) > 6) {
            const key: string = getRandomSymbol();
    
            for (let index = 0; index < 3; index+=1) {
                ticket.push(key);
            }
        } else {
            for (let index = 0; index < 3; index+=1) {
                ticket.push(getRandomSymbol());
            }
        }
        
        return ticket;
    }
}
