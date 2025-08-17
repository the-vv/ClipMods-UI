import { inject, Injectable, signal } from '@angular/core';
import { PocketbaseService } from './pocketbase-service';
import { CollectionNames } from '../enums/collection-names';
import { Mod } from '../models/mod.model';
import { Subject } from 'rxjs';
import { Recent } from '../models/recents.mode';

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
        requestKey: 'my-mods'
      });
  }

  getRecents(recentCount = 10) {
    return new Promise<Mod[]>((resolve, reject) => {
      this.pbService.getPocketBaseInstance()
        .collection(CollectionNames.Recents)
        .getList<Recent>(1, recentCount, {
          filter: `user = "${this.pbService.getCurrentUser()?.id}"`,
          sort: '-lastUsed',
          fields: 'id,mod,lastUsed',
          expand: 'mod',
        }).then(res => {
          if (!res || !res.items) {
            reject(new Error('Error fetching recent mods'));
            return;
          }
          const ids = res.items.map(item => item.mod);
          const lastUsedById = new Map<string, Date>();
          res.items.forEach(item => {
            lastUsedById.set(item.mod, new Date(item.lastUsed!));
          });
          this.pbService.getPocketBaseInstance()
            .collection(CollectionNames.Mods)
            .getFullList<Mod>(recentCount, {
              filter: ids.map(id => `id = "${id}"`).join(' || '),
              fields: 'id,name,description,version,inputCount,isPublic,updated',
              requestKey: 'recent-mods'
            }).then(mods => {
              mods.forEach(mod => {
                mod.lastUsed = lastUsedById.get(mod.id!);
              });
              resolve(mods);
            }).catch(err => {
              reject(err);
            });
        }).catch(err => {
          reject(err);
        });
    });
  }

  async updateLastUsed(modId: string) {
    let recentItem: Recent | null = null;
    try {
      recentItem = await this.pbService.getPocketBaseInstance()
        .collection(CollectionNames.Recents)
        .getFirstListItem<Recent>(`user = "${this.pbService.getCurrentUser()?.id}" && mod = "${modId}"`);
    } catch (error) {
      this.pbService.getPocketBaseInstance()
        .collection(CollectionNames.Recents)
        .create({
          user: this.pbService.getCurrentUser()?.id,
          mod: modId,
          lastUsed: new Date(),
        });
    }
    if (recentItem) {
      this.pbService.getPocketBaseInstance()
        .collection(CollectionNames.Recents)
        .update(recentItem.id!, {
          lastUsed: new Date(),
        });
    }
  }

  getPublicMods(page: number, perPage: number, searchStr?: string) {
    const searchQuery = searchStr ? `name ~ "${searchStr}" || description ~ "${searchStr}"` : undefined;
    return this.pbService.getPocketBaseInstance()
      .collection(CollectionNames.Mods)
      .getList<Mod>(page, perPage, {
        filter: `isPublic = true ${searchQuery ? `&& (${searchQuery})` : ''}`,
        sort: '-updated',
        fields: 'id,name,description,version,inputCount,isPublic,updated',
        requestKey: 'public-mods'
      });
  }
}
