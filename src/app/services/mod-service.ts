import { inject, Injectable } from '@angular/core';
import { PocketbaseService } from './pocketbase-service';
import { CollectionNames } from '../enums/collection-names';
import { Mod } from '../models/mod.model';

@Injectable({
  providedIn: 'root'
})
export class ModService {

  private readonly pbService = inject(PocketbaseService);

  createMod(mod: Mod) {
    return this.pbService.getPocketBaseInstance()
      .collection(CollectionNames.Mods).create(mod);
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
