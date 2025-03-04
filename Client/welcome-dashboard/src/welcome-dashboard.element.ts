import { css, html, customElement, state, repeat } from "@umbraco-cms/backoffice/external/lit";
import { type UmbCurrentUserModel, UMB_CURRENT_USER_CONTEXT } from "@umbraco-cms/backoffice/current-user";
import { type UmbUserDetailModel, UmbUserCollectionRepository } from '@umbraco-cms/backoffice/user';
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";



@customElement('my-welcome-dashboard')
export class MyWelcomeDashboardElement extends UmbLitElement {
  
  @state()
  private _currentUser?: UmbCurrentUserModel;

  @state()
  private _userData: Array<UmbUserDetailModel> = [];

  #userRepository = new UmbUserCollectionRepository(this);

  constructor() {
    super();
    this.consumeContext(UMB_CURRENT_USER_CONTEXT, (instance) => {
        this._observeCurrentUser(instance);
    });    
    this._getPagedUserData();
  }

  private async _observeCurrentUser(instance: typeof UMB_CURRENT_USER_CONTEXT.TYPE) {
    this.observe(instance.currentUser, (currentUser) => {
        this._currentUser = currentUser;
    });
}

private async _getPagedUserData() {
	 const { data } = await this.#userRepository.requestCollection();
   this._userData = data?.items ?? [];
}

private _renderUser(user: UmbUserDetailModel) {
	return html`<div class="user">
		<div>${user.name}</div>
		<div>${user.email}</div>
		<div>${user.state}</div>
	</div>`;
}

  render() {
    return html`
      <h1>
      <umb-localize key="welcomeDashboard_heading">Welcome</umb-localize>
      ${this._currentUser?.name ?? "Unknown"}!
      </h1>
      <div>
        <p>
        <umb-localize key="welcomeDashboard_bodytext">
          This is the Backoffice. From here, you can modify the content,
          media, and settings of your website.
        </umb-localize>
      </p>
      <p>
      <umb-localize key="welcomeDashboard_copyright">
        © Sample Company 20XX
      </umb-localize>
     </p>
      </div>
      <div id="users-wrapper">
        ${repeat(this._userData, (user) => user.unique, (user) => this._renderUser(user))}
     </div>
    `;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: 24px;
      }
      #users-wrapper {
        border: 1px solid lightgray;
      }
      .user {
        padding: 5px 10px;
      }
      .user:not(:first-child) {
        border-top: 1px solid lightgray;
      }
    `,
  ];
}

export default MyWelcomeDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    'my-welcome-dashboard': MyWelcomeDashboardElement;
  }
}