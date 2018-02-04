<ion-header>


  <ion-navbar>
    <ion-buttons left>
      <button ion-button icon-only menuToggle>
        <ion-icon name="menu" color="base2"></ion-icon>
      </button>
    </ion-buttons>
    <ion-buttons end>
      <button ion-button icon-only (click)="searchReg()">
        <ion-icon name="search" color="base2"></ion-icon>
      </button>
    </ion-buttons>
  </ion-navbar>
  <ion-segment [(ngModel)]="sections" color="secondary" class="homeSegment">
      <ion-segment-button value="home">
        <span class="segmentFont">home</span>
      </ion-segment-button>
      <ion-segment-button value="reports" (click)="loadSegment('cars')">
        <span class="segmentFont">Cars</span>
      </ion-segment-button>
      <ion-segment-button value="reportCar">
        <span class="segmentFont">Report Car</span>
      </ion-segment-button>
    </ion-segment>
    <div [ngSwitch]="sections">
    <section *ngSwitchCase="'reports'"  style="background-color:#F4E6D2;height:100%">
      <ion-item >
        <ion-label>Viewing Province</ion-label>
        <ion-select [(ngModel)]="gaming">
          <ion-option value="all" selected="true">All</ion-option>
          <ion-option value="nes">Free State</ion-option>
          <ion-option value="n64">Gauteng</ion-option>
          <ion-option value="ps">North West</ion-option>
          <ion-option value="genesis">Limpopo</ion-option>
          <ion-option value="saturn">Mpumalanga</ion-option>
          <ion-option value="snes">Eastern Cape</ion-option>
          <ion-option value="s">Northern Cape</ion-option>
          <ion-option value="ss">Kwazulu-Natala</ion-option>
        </ion-select>
      </ion-item>
    </section>
  </div>
</ion-header>

<ion-content [ngSwitch]="sections" >
  <section  [style.display]="sections == 'home' ? 'block' : 'none'"style="height:100%">
              <div class="mapContainer" id="mapContainer" data-tap-disabled="true">
                <section class="location" padding>
                  <ion-grid>
                  <ion-row>
                    <ion-col col-2><ion-icon name="pin" style="font-size:40px;margin-top:-10px" color="addon1"></ion-icon></ion-col>
                    <ion-col col-10 style="margin-top:-15px">
                      <ion-row>
                        <ion-col col-12><span style="color:white"><b>{{district}},{{city}}</b></span></ion-col>
                        <ion-col col-12><span style="color:#0BFF5B">Current location </span></ion-col>
                      </ion-row>
                    </ion-col>
                  </ion-row>
                </ion-grid>
                </section>
              </div>
              <ion-buttons end>
                <button ion-button basic color="customGreen" class="refresh"><ion-icon name="refresh" style="color:white" ></ion-icon></button>
              </ion-buttons>
              <section class="statistics" style="margin-top:-25px" >
                   <h6 style="opacity:0.6" align="center"><b>19 March 2016</b></h6>
                   <hr>
                   <ion-grid>
                   <ion-row align="center">
                     <ion-col col-4 class="first">
                       <div class="missingcars">
                         <br>
                        <ion-badge item-end style="background:none">Reported </ion-badge>
                        <br>
                         <ion-col col-2><ion-icon name="car" color="addon1" class="homeicons" style="color:#04bc64"></ion-icon></ion-col>
                         <br>
                        <ion-badge item-end>13</ion-badge>
                       </div>
                     </ion-col>
                     <ion-col col-4 class="mid">
                       <div class="zonerisk">
                         <br>
                        <ion-badge item-end style="background:none">Zone Risk</ion-badge>
                        <br>
                         <ion-col col-2><ion-icon name="warning" color="addon1" class="homeicons" style="color:#ff0000"></ion-icon></ion-col>
                         <br>
                        <ion-badge item-end>15%</ion-badge>
                       </div>
                     </ion-col>
                     <ion-col col-4 class="last">
                       <div class="totalreports">
                         <br>
                        <ion-badge item-end style="background:none">Reputation</ion-badge>
                        <br>
                         <ion-col col-2><ion-icon name="happy" color="addon1" class="homeicons"style="color:#061e22"></ion-icon></ion-col>
                         <br>
                        <ion-badge item-end>Good</ion-badge>
                       </div>
                     </ion-col>
                   </ion-row>
                 </ion-grid>
               </section>
               <br>
               <hr>
      </section>
    <section *ngSwitchCase="'reports'"  padding style="background-color:#F4E6D2;height:100%;margin-top:35px">
    <ion-item class="item-container" *ngFor="let key of listKeys" (click)="showCar(key)" style="background-color:white;margin-top:5px;height:auto;width:107%;margin-left:-10px" no-lines>
      <ion-avatar item-start>
        <img src="../../assets/placeholder.jpg">
      </ion-avatar>
      <ion-grid style="margin-bottom:-12px">
      <ion-row style="opacity:0.6">
        <ion-col col-8><h2 style="opacity:0.5">{{reportList[key].carname}}</h2></ion-col>
        <ion-col col-4  style="opacity:0.5;margin-top:-5px">{{reportList[key].carmissingdate}}</ion-col>
        <!-- <ion-icon name="checkmark-circle" style="margin-top:0px;color:#0AFF5F"> -->
      </ion-row>
    </ion-grid>
      <hr>  <span></span>
    <span></span>
      <span></span>
      <ion-grid style="margin-top:-10px">
      <ion-row style="opacity:0.6">
        <ion-col col-4><ion-icon name="eye" style="margin-top:5px;color:#F37936"  ></ion-icon><span  style="margin-left:10px;" >{{reportList[key].views}}</span></ion-col>
        <ion-col col-4><ion-icon name="heart" style="margin-top:5px;color:#ED6F70"></ion-icon><span  style="margin-left:10px" >{{reportList[key].hope}}</span></ion-col>
        <ion-col col-4><ion-icon name="cash" style="margin-top:7px;color:#00AE7A"></ion-icon><span  style="margin-left:10px;margin-top:-2px;" >{{reportList[key].reward ? "YES" : "NO"}}</span></ion-col>
      </ion-row>
    </ion-grid>
    </ion-item>

    <hr style="opacity:0">
    <button ion-button round color="dark" color="customGreen" style="opacity:0.5;margin-left:auto;margin-right:auto;display:block;color:white;height:5%"><small>See more</small></button>

  </section>
  <section *ngSwitchCase="'reportCar'" align="center" style="margin-left:auto;margin-right:auto:display:block">
    <button ion-button basic color="customGreen" align="center" style="color:white;margin-top:50%;width:40%;box-shadow:none" (click)="start()"><b>START</b></button>
  </section>
</ion-content>
