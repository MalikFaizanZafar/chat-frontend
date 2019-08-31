import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGQLComponent } from './chat-gql.component';

describe('ChatGQLComponent', () => {
  let component: ChatGQLComponent;
  let fixture: ComponentFixture<ChatGQLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatGQLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatGQLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
