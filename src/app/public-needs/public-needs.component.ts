import { Component } from '@angular/core';
import {NeedingEvent} from "../models/needing-event";
import {PublicNeedsService} from "../services/public-needs.service";

@Component({
  selector: 'app-public-needs',
  templateUrl: './public-needs.component.html',
  styleUrl: './public-needs.component.css'
})
export class PublicNeedsComponent {

  publicNeeds: NeedingEvent[] = [];


  showExploreLabel = false;
  constructor(private needsService: PublicNeedsService) { }

  ngOnInit(): void {
    this.needsService.getPublicNeeds().subscribe({
      next: (needs) => this.publicNeeds = needs,
      error: (err) => console.error('Failed to fetch public needs', err)
    });
  }
}
