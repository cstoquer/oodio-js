
function TestModule(params) {
	Module.call(this, params);

	this.input = ROOT.UNPLUGGED;
	this.out   = [0.0];
}
inherit(TestModule, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
TestModule.prototype.description_moduleName = 'TestModule';
TestModule.prototype.description_moduleSize = 3;
TestModule.prototype.description_rate       = 'E';
TestModule.prototype.description_inputs     = {
	/*a0_00:  { rate: 'E', x:0,  y:0 },*/ a1_00:  { rate: 'E', x:0,  y:1 }, a2_00:  { rate: 'E', x:0,  y:2 },
	/*a0_01:  { rate: 'E', x:1,  y:0 },*/ a1_01:  { rate: 'E', x:1,  y:1 }, a2_01:  { rate: 'E', x:1,  y:2 },
	/*a0_02:  { rate: 'E', x:2,  y:0 },*/ a1_02:  { rate: 'E', x:2,  y:1 }, a2_02:  { rate: 'E', x:2,  y:2 },
	/*a0_03:  { rate: 'E', x:3,  y:0 },*/ a1_03:  { rate: 'E', x:3,  y:1 }, a2_03:  { rate: 'E', x:3,  y:2 },
	/*a0_04:  { rate: 'E', x:4,  y:0 },*/ a1_04:  { rate: 'E', x:4,  y:1 }, a2_04:  { rate: 'E', x:4,  y:2 },
	a0_05:  { rate: 'E', x:5,  y:0 }, a1_05:  { rate: 'E', x:5,  y:1 }, a2_05:  { rate: 'E', x:5,  y:2 },
	a0_06:  { rate: 'E', x:6,  y:0 }, a1_06:  { rate: 'E', x:6,  y:1 }, a2_06:  { rate: 'E', x:6,  y:2 },
	a0_07:  { rate: 'E', x:7,  y:0 }, a1_07:  { rate: 'E', x:7,  y:1 }, a2_07:  { rate: 'E', x:7,  y:2 },
	a0_08:  { rate: 'E', x:8,  y:0 }, a1_08:  { rate: 'E', x:8,  y:1 }, a2_08:  { rate: 'E', x:8,  y:2 },
	a0_09:  { rate: 'E', x:9,  y:0 }, a1_09:  { rate: 'E', x:9,  y:1 }, a2_09:  { rate: 'E', x:9,  y:2 },
	a0_10:  { rate: 'E', x:10, y:0 }, a1_10:  { rate: 'E', x:10, y:1 }, a2_10:  { rate: 'E', x:10, y:2 },
	a0_11:  { rate: 'E', x:11, y:0 }, a1_11:  { rate: 'E', x:11, y:1 }, a2_11:  { rate: 'E', x:11, y:2 },
	a0_12:  { rate: 'E', x:12, y:0 }, a1_12:  { rate: 'E', x:12, y:1 }, a2_12:  { rate: 'E', x:12, y:2 },
	a0_13:  { rate: 'E', x:13, y:0 }, a1_13:  { rate: 'E', x:13, y:1 }, a2_13:  { rate: 'E', x:13, y:2 },
	a0_14:  { rate: 'E', x:14, y:0 }, a1_14:  { rate: 'E', x:14, y:1 }, a2_14:  { rate: 'E', x:14, y:2 },
	a0_15:  { rate: 'E', x:15, y:0 }, a1_15:  { rate: 'E', x:15, y:1 }, a2_15:  { rate: 'E', x:15, y:2 },
	a0_16:  { rate: 'E', x:16, y:0 }, a1_16:  { rate: 'E', x:16, y:1 }, a2_16:  { rate: 'E', x:16, y:2 },
};
TestModule.prototype.description_outputs    = {};
TestModule.prototype.description_params     = {};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

TestModule.prototype.tic = function () {}