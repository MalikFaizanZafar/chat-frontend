import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import Message from "../Models/Message.model";
import { Observable } from "rxjs";
import { Apollo, QueryRef } from "apollo-angular";
import gql from "graphql-tag";

const addNewMessage = gql`
  mutation addNewMessage(
    $sender: Float!
    $receiver: Float!
    $content: String!
  ) {
    addNewMessage(
      input: { sender: $sender, receiver: $receiver, content: $content }
    ) {
      senderId
      receiverId
      content
    }
  }
`;
const GETMESSAGES = gql`
  {
    getMessages {
      content
      senderId
      receiverId
      id
    }
  }
`;
const MESSAGEADDED = gql`
  subscription messageAdded($receiverId: Float!) {
    messageAdded(receiverId: $receiverId) {
      senderId
      receiverId
      content
    }
  }
`;

@Component({
  selector: "app-chat-gql",
  templateUrl: "./chat-gql.component.html",
  styleUrls: ["./chat-gql.component.scss"]
})
export class ChatGQLComponent implements OnInit {
  public users: number = 0;
  public showChatBox: boolean = true;
  public showGroupChatBox: boolean = true;
  public message: Message;
  private usersList = [];
  private groupsList = [];
  public messages = [];
  private userMessages: Observable<any[]>;
  private groupMessages: Observable<any[]>;
  private usersConversation = [];
  private groupConversation = [];
  private groupMessagesArray = [];
  private currentUser;
  private selectedUser;
  private selectedGroup;

  messagesQuery: QueryRef<any>;
  @ViewChild("msgRef", { static: false }) msgRef;
  @ViewChild("groupMsgRef", { static: false }) groupMsgRef;
  constructor(private apollo: Apollo, private db: AngularFireDatabase) {
    this.messagesQuery = this.apollo.watchQuery({
      query: GETMESSAGES
    });
  }

  ngOnInit() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            getUsers {
              id
              name
              photo
            }
          }
        `
      })
      .valueChanges.subscribe(result => {
        this.usersList = result.data["getUsers"];
        this.selectedUser = this.usersList[0];
        this.apollo
          .watchQuery({
            query: gql`
              {
                getMessages {
                  content
                  senderId
                  receiverId
                  id
                }
              }
            `
          })
          .valueChanges.subscribe(result => {
            this.messages = result.data["getMessages"];
            console.log("messages are : ", this.messages);
          });
      });

    this.apollo
      .subscribe({
        query: MESSAGEADDED,
        variables: {
          receiverId: parseFloat(this.selectedUser.id)
        }
      })
      .subscribe(({ data }) => {
        console.log("subscripton Data is : ", data);
        this.messages = [...this.messages, data.messageAdded];
        this.usersConversation = [...this.usersConversation, data.messageAdded];
      });
  }

  onUserClicked(user) {
    this.selectedUser = user;
    console.log("selectedUser is : ", this.selectedUser);
    this.showChatBox = !this.showChatBox;
    this.usersConversation = this.messages.filter(
      msg =>
        msg.senderId == this.selectedUser.id ||
        msg.receiverId == this.selectedUser.id
    );
  }

  onGroupClicked(group) {
    this.selectedGroup = group;
    this.showGroupChatBox = !this.showGroupChatBox;
    this.groupConversation = this.groupMessagesArray.filter(
      msg => msg.groupId == this.selectedGroup.id
    );
  }

  addMessage() {
    // console.log("this.currentUser is : ", this.currentUser);
    this.apollo
      .mutate({
        mutation: addNewMessage,
        variables: {
          sender: 3,
          receiver: parseFloat(this.selectedUser.id),
          content: this.msgRef.nativeElement.value
        }
      })
      .subscribe(
        ({ data }) => {
          this.messages.push(data["addNewMessage"]);
          this.usersConversation.push(data["addNewMessage"]);
          this.msgRef.nativeElement.value = "";
        },
        err => {
          console.log("err is : ", err);
        }
      );
  }

  addMessageToGroup() {
    let newMessage = {
      sender: this.currentUser.id,
      senderName: this.currentUser.name,
      groupId: this.selectedGroup.id,
      text: this.groupMsgRef.nativeElement.value,
      date: new Date().toISOString().split("T")[0]
    };
    let senderDbRef = this.db.database.ref(`group-messages`);
    senderDbRef.push(newMessage);
    this.groupMsgRef.nativeElement.value = "";
  }
}
