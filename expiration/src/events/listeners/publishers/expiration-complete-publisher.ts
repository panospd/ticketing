import { ExpirationCompleteEvent, Publisher, Subjects } from "@ticketingpd/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>
{
    readonly subject = Subjects.ExpirationComplete;
}