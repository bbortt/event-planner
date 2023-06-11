import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMember } from '../member.model';

@Component({
  selector: 'jhi-member-detail',
  templateUrl: './member-detail.component.html',
})
export class MemberDetailComponent implements OnInit {
  member: IMember | null = null;

  constructor(private activatedRoute: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ member }) => {
      this.member = member;
    });
  }

  previousState(): void {
    this.location.back();
  }
}
