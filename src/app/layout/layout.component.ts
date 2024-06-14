import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{

  userId: string | null = null;
  showExploreLabel: boolean = true;
  showMyNeeds: boolean = false;

  constructor(private router: Router, private authService: AuthService) {

  }

  updateUserId(): void {
    this.userId = sessionStorage.getItem('userId');
  }

  navigateAndRefresh(url: string): void {
    this.router.navigateByUrl('/public-needs', {skipLocationChange: true}).then(() => {
      this.router.navigate([url]);
    });
  }
  ngOnInit(): void {
    this.updateUserId();
    this.authService.userStatusChanges.subscribe(() => {
      this.updateUserId();
    });
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateLinkVisibility(event.url);
      if (event.urlAfterRedirects.includes('/public-needs')) {
        this.showExploreLabel = false;
      } else {
        this.showExploreLabel = true;
      }
    });
  }

  updateLinkVisibility(url: string): void {
    this.showMyNeeds = sessionStorage.getItem('userId') !== null && !url.includes('/all-needs-by-user');
  }



}
