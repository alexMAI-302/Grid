Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*'
]);

Ext.onReady(function(){
    // Define our data model
    Ext.define('Employee', {
        extend: 'Ext.data.Model',
        fields: [
			'smth',
            'name',
            'email',
            { name: 'salary', type: 'float' },
        ]
    });
	Ext.define('NewColumn', {
		extend: 'Ext.data.Model',
		fields: [
			'field1',
			'field2',
			'field3',
		]
	});

    // Generate mock employee data
    var data = (function() {
        var lasts = ['Jones', 'Smith', 'Lee', 'Wilson', 'Black', 'Williams', 'Lewis', 'Johnson', 'Foot', 'Little', 'Vee', 'Train', 'Hot', 'Mutt'],
            firsts = ['Fred', 'Julie', 'Bill', 'Ted', 'Jack', 'John', 'Mark', 'Mike', 'Chris', 'Bob', 'Travis', 'Kelly', 'Sara'],
			smthHeader = ['Вес по маш.', 'Под. по маш.', 'Объем по маш.'],
            lastLen = lasts.length,
            firstLen = firsts.length,
            usedNames = {},
            data = [],
            getRandomInt = Ext.Number.randomInt,
			
			

            generateName = function() {
                var name = firsts[getRandomInt(0, firstLen - 1)] + ' ' + lasts[getRandomInt(0, lastLen - 1)];
                if (usedNames[name]) {
                    return generateName();
                }
                usedNames[name] = true;
                return name;
            };

        
            var ecount = 3;
            for (var i = 0; i < ecount; i++) {
                var name = generateName();
                data.push({
					smth: smthHeader[i],
                    name : name,
                    email: name.toLowerCase().replace(' ', '.') + '@sencha-test.com',
                    salary: Math.floor(getRandomInt(35000, 85000) / 1000) * 1000
                });
            }
        return data;
    })();

    // create the Data Store
    var store = Ext.create('Ext.data.Store', {
        // destroy the store if the grid is destroyed
        autoDestroy: true,
        model: 'Employee',
        proxy: {
            type: 'memory'
        },
        data: data,
        sorters: [{
            direction: 'ASC'
        }]
    });

    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        autoCancel: false
    });
	
	

    // create the grid and specify what field you want
    // to use for the editor at each column.
    var grid = Ext.create('Ext.grid.Panel', {
        store: store,
        columns: [
			{
			header: '',
			dataIndex: 'smth',
			width: 120,
			editor: {
				allowBlank: false
			}
		},
			{
			header: '№1',
			dataIndex: 'num1',
			width: 50,
			editor: {
				xtype: 'numberfield',
				allowBlank: false
			}
		},
			{
			header: '№2',
			dataIndex: 'num2',
			width: 50,
			editor: {
				xtype: 'numberfield',
				allowBlank: false
			}
		},
		
			{
            header: 'Name',
            dataIndex: 'name',
            width: 150,
            editor: {
                // defaults to textfield if no xtype is supplied
                allowBlank: false
            }
        }, {
            header: 'Email',
            dataIndex: 'email',
            width: 160,
            editor: {
                allowBlank: false,
                vtype: 'email'
            }
        }, {
            xtype: 'numbercolumn',
            header: 'Salary',
            dataIndex: 'salary',
            format: '$0,0',
            width: 90,
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                minValue: 1,
                maxValue: 150000
            }
        }
		],
        renderTo: 'editor-grid',
        width: 1000,
        height: 400,
        title: 'Employee Salaries',
        frame: true,
        tbar: [{
            text: 'Add Employee',
            iconCls: 'employee-add',
            handler : function() {
                rowEditing.cancelEdit();

                // Create a model instance
                var r = Ext.create('Employee', {
                    name: 'New Guy',
                    email: 'new@sencha-test.com',
                    salary: 50000,
                    
                });
				
				
                store.insert(0, r);
                rowEditing.startEdit(0, 0);
				
            }
        }, {
            itemId: 'removeEmployee',
            text: 'Remove Employee',
            iconCls: 'employee-remove',
            handler: function() {
                var sm = grid.getSelectionModel();
                rowEditing.cancelEdit();
                store.remove(sm.getSelection());
                if (store.getCount() > 0) {
                    sm.select(0);
                }
            },
            disabled: true
        }],
        plugins: [rowEditing],
        listeners: {
            'selectionchange': function(view, records) {
                grid.down('#removeEmployee').setDisabled(!records.length);
            }
        }
    });
});
