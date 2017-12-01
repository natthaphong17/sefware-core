import {Injectable} from '@angular/core';
import {Upload} from "../shared/model/upload";
import {AngularFireDatabase} from "angularfire2/database";
import {FirebaseApp} from 'angularfire2';
import 'firebase/storage';
import * as firebase from 'firebase/app';

@Injectable()
export class UploadService {
  constructor(private firebaseApp: FirebaseApp, private db: AngularFireDatabase) {
  }

  pushUpload(type:string, path:string,upload: Upload) {
    let storageRef = this.firebaseApp.storage().ref();

    let metadata = {
      contentType: type,
    };

    return storageRef.child(path).put(upload.file,metadata);
  }

  pushUploadNotype(path:string,upload: Upload) {
    let storageRef = this.firebaseApp.storage().ref();
    return storageRef.child(path).put(upload.file);
  }

  // Writes the file details to the realtime db
  private saveFileData(path:string,upload: Upload) {
    this.db.list(`${path}/`).push(upload);
  }

  deleteUpload(path:string,upload: Upload) {
    this.deleteFileData(path,upload.$key)
      .then( () => {
        this.deleteFileStorage(path,upload.name);
      })
      .catch(error => console.log(error));
  }
  // Deletes the file details from the realtime db
  private deleteFileData(path:string,key: string) {
    return this.db.list(`${path}/`).remove(key);
  }
  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key
  deleteFileStorage(path:string,name:string) {
    let storageRef = firebase.storage().ref();
    return storageRef.child(`${path}/${name}`).delete();
  }


}
