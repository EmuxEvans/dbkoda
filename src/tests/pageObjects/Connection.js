/**
 * @Author: Wahaj Shamim <wahaj>
 * @Date:   2017-05-01T09:06:09+10:00
 * @Email:  wahaj@southbanksoftware.com
 * @Last modified by:   wahaj
 * @Last modified time: 2018-06-01T09:07:56+10:00
 */

import Page from './Page';
import { DELAY_TIMEOUT } from '../helpers/config';

export default class ConnectionProfile extends Page {
  newProfileButtonSelector = '.newProfileButton';

  connectionProfilePanel = '.ProfileManager';

  basicConnectionSettings = '.ProfileManager .connectionLeftPane .btn-basic';

  clusterConnectionSettings = '.ProfileManager .connectionLeftPane .btn-cluster';

  urlbuilderConnectionSettings = '.ProfileManager .connectionLeftPane .btn-url';

  sshConnectionSettings = '.ProfileManager .connectionLeftPane .btn-ssh';

  aliasInputParentSelector = '.ProfileManager .connectionLeftPane .pt-input-alias';

  aliasInputSelector = '.ProfileManager .connectionLeftPane .pt-input-alias > input.pt-editable-input';

  // Basic Connection Page Objects
  useBasicConfigSwitchSelector = 'input#useBasicConfig';

  hostNameInputSelector = 'input#host';

  portInputSelector = 'input#port';

  databaseInputSelector = 'input#database';

  urlRadioSelector = 'input#urlRadio';

  urlSelector = 'input#url';

  sslCheckboxSelector = 'input#ssl';

  sslInvalidCertsCheckboxSelector = 'input#sslAllowInvalidCertificates';

  shaCheckboxSelector = 'input#sha';

  userNameInputSelector = 'input#username';

  passwordInputSelector = 'input#password';

  authDatabaseInputSelector = 'input#authenticationDatabase';

  // Cluster Configuration Page Objects

  useClusterConfigSwitchSelector = 'input#useClusterConfig';

  hostsListInputSelector = 'input#hostsList';

  replicaSetNameInputSelector = 'input#replicaSetName';

  wInputSelector = 'input#w';

  wtimeoutMSInputSelector = 'input#wtimeoutMS';

  journalCheckboxSelector = 'input#journal';

  readPrefComboSelector = 'select#readPref';

  urlClusterRadioSwitchSelector = 'input#urlClusterRadio';

  urlClusterInputSelector = 'input#urlCluster';

  databaseClusterInputSelector = 'input#databaseCluster';

  sslClusterCheckboxSelector = 'input#sslCluster';

  sslAllowInvalidCertsClusterCheckboxSelector = 'input#sslAllowInvalidCertificatesCluster';

  shaClusterSwitchSelector = 'input#shaCluster';

  usernameClusterInputSelector = 'input#usernameCluster';

  passwordClusterInputSelector = 'input#passwordCluster';

  authenticationDatabaseClusterInputSelector = 'input#authenticationDatabaseCluster';

  // SSH Options Page Objects
  sshCheckboxSelector = 'input#ssh';

  remoteHostInputSelector = 'input#remoteHost';

  sshPortInputSelector = 'input#sshPort';

  remoteUserInputSelector = 'input#remoteUser';

  remotePassInputSelector = 'input#remotePass';

  sshTunnelCheckboxSelector = 'input#sshTunnel';

  keyRadioSelector = 'input#keyRadio';

  sshKeyFileInputSelector = 'input#sshKeyFile';

  passPhraseInputSelector = 'input#passPhrase';

  connectButtonSelector = '.ProfileManager .profile-button-panel .connectButton';
  closeButtonSelector = '.ProfileManager .close-button';
  resetButtonSelector = '.ProfileManager .profile-button-panel .reset-button';
  testButtonSelector = '.ProfileManager .profile-button-panel .test-button';
  saveButtonSelector = '.ProfileManager .profile-button-panel .save-button';

  /**
   * open connection panel
   */
  openConnectionProfilePanel() {
    this.browser
      .waitForExist('.optInAlert', 2000, true)
      .waitForExist(this.newProfileButtonSelector)
      .leftClick(this.newProfileButtonSelector)
      .waitForExist(this.connectionProfilePanel)
      .pause(500);
    return this._connectProfileElementsExist();
  }

  /**
   * this method will fill in the profile data into connection form then
   * click connect button.
   * @param profile connection parameters in the panel. Following is the accepted parameter keys in this object.
   * {
   *  alias, hostName, port, database, ssl, authentication, userName, password
   * }
   */
  connectProfileByHostname(profile) {
    return this._connectProfile(profile);
  }

  /**
   * connect through url
   * @param profile connection parameters in the panel. Following is the accepted parameter keys in this object.
   * {
   *  alias, url, database, ssl, authentication, userName, password
   * }
   */
  connectProfileByURL(profile) {
    return this._connectProfile(profile);
  }

  /**
   * save the profile connection
   * @param profile
   * @returns {*}
   */
  saveProfile(profile) {
    return this.fillConnectionProfileData(profile).then(() => {
      this.browser
        .leftClick(this.saveButtonSelector)
        .waitForExist(this.connectionProfilePanel, DELAY_TIMEOUT, true);
    });
  }

  /**
   * make a connection based on the profile parameter. This method fills in the profile parameter into panel first then click connection.
   * @param profile  see @connectProfileByURL method for this parameter
   */
  _connectProfile(profile) {
    return this.fillConnectionProfileData(profile).then(() => {
      return this.browser
        .waitForEnabled(this.connectButtonSelector)
        .leftClick(this.connectButtonSelector)
        .waitForExist(this.connectionProfilePanel, DELAY_TIMEOUT, true);
    });
  }

  /**
   * check all elements exists on connection profile
   */
  _connectProfileElementsExist() {
    return this.browser
      .waitForExist(this.aliasInputParentSelector)
      .waitForExist(this.hostNameInputSelector)
      .waitForExist(this.portInputSelector)
      .waitForExist(this.databaseInputSelector)
      .waitForExist(this.urlRadioSelector)
      .waitForExist(this.urlSelector);
  }

  /**
   * fill in connection profile form data. it will check whether conneciton panel open or not. it will open the connection panel if it closed.
   * @param  profile  see @connectProfileByURL method for this parameter
   */
  async fillConnectionProfileData(profile) {
    let bro = this.browser;
    if (!(await this.browser.isExisting(this.connectionProfilePanel))) {
      bro = this.openConnectionProfilePanel();
    }
    if (profile.alias) {
      await bro
        .leftClick(this.aliasInputParentSelector)
        .waitForExist(this.aliasInputSelector)
        .setValue(this.aliasInputSelector, '')
        .setValue(this.aliasInputSelector, profile.alias)
        .waitForValue(this.aliasInputSelector, profile.alias);
    }

    if (profile.useClusterConfig) {
      await bro
        .leftClick(this.clusterConnectionSettings)
        .waitForExist(this.useClusterConfigSwitchSelector)
        .leftClick(this.useClusterConfigSwitchSelector)
        .waitForEnabled(this.hostsListInputSelector);
      if (profile.hostsList) {
        await bro
          .setValue(this.hostsListInputSelector, profile.hostsList)
          .waitForValue(this.hostsListInputSelector, profile.hostsList);
      }
      if (profile.replicaSetName) {
        await bro
          .setValue(this.replicaSetNameInputSelector, profile.replicaSetName)
          .waitForValue(this.replicaSetNameInputSelector, profile.replicaSetName);
      }
      if (profile.w) {
        await bro
          .setValue(this.wInputSelector, profile.w)
          .waitForValue(this.wInputSelector, profile.w);
      }
      if (profile.wtimeoutMS) {
        await bro
          .setValue(this.wtimeoutMSInputSelector, profile.wtimeoutMS)
          .waitForValue(this.wtimeoutMSInputSelector, profile.wtimeoutMS);
      }
      if (profile.journal) {
        await bro
          .waitForExist(this.journalCheckboxSelector)
          .leftClick(this.journalCheckboxSelector);
      }
      if (profile.readPref) {
        await bro
          .setValue(this.readPrefComboSelector, profile.readPref)
          .waitForValue(this.readPrefComboSelector, profile.readPref);
      }
      if (profile.urlClusterRadio && profile.urlCluster) {
        await bro
          .leftClick(this.urlClusterRadioSwitchSelector)
          .waitForEnabled(this.urlClusterInputSelector)
          .setValue(this.urlClusterInputSelector, profile.urlCluster)
          .waitForValue(this.urlClusterInputSelector, profile.urlCluster);
      }
      if (profile.databaseCluster) {
        await bro
          .setValue(this.databaseClusterInputSelector, '')
          .setValue(this.databaseClusterInputSelector, profile.databaseCluster)
          .waitForValue(this.databaseClusterInputSelector, profile.databaseCluster);
      }
      if (profile.sslCluster) {
        await bro
          .waitForExist(this.sslClusterCheckboxSelector)
          .leftClick(this.sslClusterCheckboxSelector);
      }
      if (profile.sslAllowInvalidCertificatesCluster) {
        await bro
          .waitForExist(this.sslAllowInvalidCertsClusterCheckboxSelector)
          .leftClick(this.sslAllowInvalidCertsClusterCheckboxSelector);
      }
      if (profile.shaCluster) {
        bro
          .waitForExist(this.shaClusterSwitchSelector)
          .leftClick(this.shaClusterSwitchSelector)
          .waitForEnabled(this.usernameClusterInputSelector)
          .waitForEnabled(this.passwordClusterInputSelector)
          .setValue(this.usernameClusterInputSelector, profile.usernameCluster)
          .setValue(this.passwordClusterInputSelector, profile.passwordCluster)
          .waitForValue(this.usernameClusterInputSelector)
          .waitForValue(this.passwordClusterInputSelector);
      }
      if (profile.authenticationDatabaseCluster) {
        await bro
          .waitForExist(this.authenticationDatabaseClusterInputSelector)
          .setValue(
            this.authenticationDatabaseClusterInputSelector,
            profile.authenticationDatabaseCluster
          )
          .waitForValue(
            this.authenticationDatabaseClusterInputSelector,
            profile.authenticationDatabaseCluster
          );
      }
    } else {
      if (profile.url) {
        const selected = await bro.isSelected(this.urlRadioSelector);
        if (!selected) {
          await bro.leftClick(this.urlRadioSelector).waitForEnabled(this.urlSelector);
        }
        await bro
          .setValue(this.urlSelector, profile.url)
          .waitForValue(this.urlSelector, profile.url);
      }
      if (profile.hostName) {
        await bro
          .setValue(this.hostNameInputSelector, profile.hostName)
          .waitForValue(this.hostNameInputSelector, profile.hostName)
          .setValue(this.portInputSelector, profile.port)
          .waitForValue(this.portInputSelector, profile.port);
      }
      if (profile.database) {
        await bro
          .setValue(this.databaseInputSelector, '')
          .setValue(this.databaseInputSelector, profile.database)
          .waitForValue(this.databaseInputSelector, profile.database);
      }
      await this._selectSSL(profile, bro);
      await this._fillInAuthentication(profile, bro);
      if (profile.authentication && profile.authenticationDatabase) {
        await bro
          .waitForExist(this.authDatabaseInputSelector)
          .setValue(this.authDatabaseInputSelector, profile.authenticationDatabase)
          .waitForValue(this.authDatabaseInputSelector, profile.authenticationDatabase);
      }
    }

    if (profile.ssh) {
      await bro
        .leftClick(this.sshConnectionSettings)
        .waitForExist(this.sshCheckboxSelector)
        .leftClick(this.sshCheckboxSelector)
        .waitForExist(this.remoteHostInputSelector)
        .waitForExist(this.remoteUserInputSelector)
        .setValue(this.remoteHostInputSelector, profile.remoteHost)
        .waitForValue(this.remoteHostInputSelector, profile.remoteHost)
        .setValue(this.remoteUserInputSelector, profile.remoteUser)
        .waitForValue(this.remoteUserInputSelector, profile.remoteUser);
      if (profile.keyRadio === false) {
        await bro
          .waitForExist(this.passRadioSelector)
          .leftClick(this.passRadioSelector)
          .waitForEnabled(this.remotePassInputSelector)
          .setValue(this.remotePassInputSelector, profile.remotePass)
          .waitForValue(this.remotePassInputSelector, profile.remotePass);
      } else if (profile.keyRadio) {
        await bro
          .waitForExist(this.keyRadioSelector)
          .leftClick(this.keyRadioSelector)
          .waitForEnabled(this.sshKeyFileInputSelector)
          .setValue(this.sshKeyFileInputSelector, profile.sshKeyFile)
          .waitForValue(this.sshKeyFileInputSelector, profile.sshKeyFile);
        if (profile.passPhrase) {
          await bro
            .waitForExist(this.passPhraseInputSelector)
            .waitForEnabled(this.passPhraseInputSelector)
            .setValue(this.passPhraseInputSelector, profile.passPhrase)
            .waitForValue(this.passPhraseInputSelector, profile.passPhrase);
        }
      }

      if (profile.sshTunnel) {
        await bro
          .waitForExist(this.sshTunnelCheckboxSelector)
          .leftClick(this.sshTunnelCheckboxSelector);
      }
    }
    return bro.pause(1000);
  }

  /**
   * try to select the ssl checkbox on connection panel if ssl exists on profile object.
   */
  async _selectSSL(profile, bro) {
    return profile.ssl
      ? bro.waitForExist(this.sslCheckboxSelector).leftClick(this.sslCheckboxSelector)
      : bro;
  }

  /**
   * select authentication if authentication exists in profile object
   * @param profile
   */
  async _fillInAuthentication(profile, bro) {
    return profile.authentication
      ? bro
          .waitForExist(this.shaCheckboxSelector)
          .leftClick(this.shaCheckboxSelector)
          .waitForEnabled(this.userNameInputSelector)
          .waitForEnabled(this.passwordInputSelector)
          .setValue(this.userNameInputSelector, profile.userName)
          .setValue(this.passwordInputSelector, profile.password)
          .waitForValue(this.userNameInputSelector)
          .waitForValue(this.passwordInputSelector)
      : bro;
  }

  /**
   * close connection profile
   */
  closeConnectionProfile() {
    return this.browser
      .leftClick(this.closeButtonSelector)
      .waitForExist(this.closeButtonSelector, DELAY_TIMEOUT, true);
  }

  /**
   * get current data value on profile panel
   */
  getCurrentProfileData() {
    const promises = [];
    promises.push(
      this.browser.getValue(this.aliasInputParentSelector),
      this.browser.getValue(this.hostNameInputSelector),
      this.browser.getValue(this.portInputSelector),
      this.browser.getValue(this.urlSelector),
      this.browser.getValue(this.databaseInputSelector),
      this.browser.getValue(this.userNameInputSelector),
      this.browser.getValue(this.passwordInputSelector)
    );
    return new Promise(resolve => {
      Promise.all(promises).then(v => {
        resolve({
          alias: v[0],
          hostName: v[1],
          port: v[2],
          url: v[3],
          database: v[4],
          userName: v[5],
          password: v[6]
        });
      });
    });
  }

  /**
   * click connection button
   */
  clickConnectButton() {
    return this.connect.leftClick();
  }

  _getProfileElement(name) {
    return this.browser.element('.connection-profile ' + name);
  }

  get alias() {
    return this._getProfileElement(this.aliasInputParentSelector);
  }

  get hostName() {
    return this._getProfileElement(this.hostNameInputSelector);
  }

  get port() {
    return this._getProfileElement(this.portInputSelector);
  }

  get hostRadio() {
    return this._getProfileElement(this.hostRadioInputSelector);
  }

  get urlRadio() {
    return this._getProfileElement(this.urlRadioSelector);
  }

  get url() {
    return this._getProfileElement(this.urlSelector);
  }

  get database() {
    return this._getProfileElement(this.databaseInputSelector);
  }

  get sslCheckbox() {
    return this._getProfileElement(this.sslCheckboxSelector);
  }

  get shaCheckbox() {
    return this._getProfileElement(this.shaCheckboxSelector);
  }

  get userName() {
    return this._getProfileElement(this.userNameInputSelector);
  }

  get password() {
    return this._getProfileElement(this.passwordInputSelector);
  }

  get sshCheckbox() {
    return this._getProfileElement(this.sshCheckboxSelector);
  }

  get sshTunnelCheckbox() {
    return this._getProfileElement(this.sshTunnelCheckboxSelector);
  }

  get remoteHost() {
    return this._getProfileElement(this.remoteHostInputSelector);
  }

  get sshPort() {
    return this._getProfileElement(this.sshPortInputSelector);
  }

  get remotePort() {
    return this._getProfileElement(this.remotePortInputSelector);
  }

  get remoteUser() {
    return this._getProfileElement(this.remoteUserInputSelector);
  }

  get passRadio() {
    return this._getProfileElement(this.passRadioSelector);
  }

  get remotePass() {
    return this._getProfileElement(this.remotePassInputSelector);
  }

  get keyRadio() {
    return this._getProfileElement(this.keyRadioSelector);
  }

  get sshKeyFile() {
    return this._getProfileElement(this.sshKeyFileInputSelector);
  }

  get passPhrase() {
    return this._getProfileElement(this.passPhraseInputSelector);
  }

  get connect() {
    return this._getProfileElement(this.connectButtonSelector);
  }

  get save() {
    return this._getProfileElement(this.saveButtonSelector);
  }

  get test() {
    return this._getProfileElement(this.testButtonSelector);
  }

  get reset() {
    return this._getProfileElement(this.resetButtonSelector);
  }

  get close() {
    return this._getProfileElement(this.closeButtonSelector);
  }
}
