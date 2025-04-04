import { Note } from 'core/domain/entity/note'

// 注意: 実際のアプリでは、このデータは親ルートと共有する必要があります
export const notes: Note[] = [
  {
    content: 'App Routerは、Next.js 13から導入された新しいルーティングシステムです。',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    id: '1',
    title: 'Next.js App Routerについて', // 1日前
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    content:
      'Server Actionsは、クライアントコンポーネントからサーバー関数を直接呼び出せる機能です。',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    id: '2',
    title: 'Server Actionsの基本', // 12時間前
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
]
