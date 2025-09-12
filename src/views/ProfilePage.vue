<template>
  <Layout title="Profil">
        <div class="max-w-4xl mx-auto">
          <!-- Profil Header -->
          <div class="bg-white border border-gray-200 shadow-sm mb-6">
            <div class="p-6">
              <div class="flex items-center space-x-6">
                <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <font-awesome-icon icon="user" class="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">Administrateur</h2>
                  <p class="text-gray-600">admin@test.com</p>
                  <p class="text-sm text-gray-500">Dernière connexion : Aujourd'hui à 10:30</p>
                </div>
                <div class="ml-auto">
                  <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors">
                    <font-awesome-icon icon="edit" class="mr-2" />
                    Modifier le profil
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Informations personnelles -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Informations générales -->
            <div class="bg-white border border-gray-200 shadow-sm">
              <div class="p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Informations générales</h3>
              </div>
              <div class="p-4">
                <form class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                      <input type="text" value="Administrateur" class="w-full px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <input type="text" value="Système" class="w-full px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" value="admin@test.com" class="w-full px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone 1</label>
                      <input type="tel" value="06 12 34 56 78" class="w-full px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone 2</label>
                      <input type="tel" value="01 23 45 67 89" class="w-full px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Profil</label>
                    <select class="w-full px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Administrateur</option>
                      <option>Médecin</option>
                      <option>Secrétaire</option>
                    </select>
                  </div>
                </form>
              </div>
            </div>

            <!-- Sécurité -->
            <div class="bg-white border border-gray-200 shadow-sm">
              <div class="p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Sécurité</h3>
              </div>
              <div class="p-4">
                <form class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                    <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                    <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                    <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-medium transition-colors">
                    <font-awesome-icon icon="lock" class="mr-2" />
                    Changer le mot de passe
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="bg-white border border-gray-200 shadow-sm mt-6">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Statistiques d'activité</h3>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">1,247</div>
                  <div class="text-sm text-gray-600">Patients gérés</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">892</div>
                  <div class="text-sm text-gray-600">Dossiers créés</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-orange-600">2,156</div>
                  <div class="text-sm text-gray-600">Rendez-vous planifiés</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">1,247</div>
                  <div class="text-sm text-gray-600">SMS envoyés</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 mt-6">
            <button class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors">
              Sauvegarder
            </button>
          </div>
        </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
</script>
