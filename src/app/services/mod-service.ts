import { inject, Injectable, signal } from '@angular/core';
import { PocketbaseService } from './pocketbase-service';
import { CollectionNames } from '../enums/collection-names';
import { Mod } from '../models/mod.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModService {

  private readonly pbService = inject(PocketbaseService);

  public triggerModWithId$ = new Subject<string>();
  public currentInputLength = signal(0);

  createMod(mod: Mod) {
    return this.pbService.getPocketBaseInstance()
      .collection(CollectionNames.Mods).create(mod);
  }

  getModById(modId: string): Promise<Mod> {
    return this.pbService.getPocketBaseInstance()
      .collection(CollectionNames.Mods)
      .getOne<Mod>(modId, {
        expand: 'createdBy',
      });
  }

  getMyMods(search?: string): Promise<Mod[]> {
    return this.pbService.getPocketBaseInstance()
      .collection(CollectionNames.Mods)
      .getFullList<Mod>(999, {
        filter: `createdBy = "${this.pbService.getCurrentUser()?.id}"`,
        sort: '-updated',
        fields: 'id,name,description,version,inputCount,isPublic,updated',
      });
  }
}
